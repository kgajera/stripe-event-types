import fs from "fs";
import _ from "lodash";
import path from "path";
import prettier from "prettier";
import { launch } from "puppeteer";

interface StripeDocsEventScrape {
  // Name of event, for example "charge.succeeded"
  type: string;
  // Description scraped from docs about the type of the `data.object` value, for example "card"
  objectTypes: string[];
}

interface EventTree {
  [key: string]: EventTree | boolean | string[] | undefined;
  _isLeaf?: boolean;
  _objectTypes?: string[];
}

type FlatTree = Record<
  string,
  {
    eventType: string;
    interfaceName: string;
    objectType: string;
  }
>;

interface TypingTree {
  [key: string]: null | TypingTree;
}

const TYPES_DIR = `node_modules/stripe/types`;

const typingsTree = await buildTypingFilesTree();
const scrapedEvents = await scrapeEvents();
const fullEventTypeList = await getOpenApiEventTypeList();
const unscrapedEvents = _.pullAllWith(
  fullEventTypeList,
  scrapedEvents,
  (a, b) => a == b.type
);
scrapedEvents.push(
  ...unscrapedEvents.map((type) => ({
    type,
    objectTypes: [],
  }))
);

const eventTree = buildEventTree(scrapedEvents);
const flatTree = buildFlatEventTree(eventTree);

await fs.promises.writeFile(
  path.join("index.d.ts"),
  format(`
    declare module "stripe" {
      namespace Stripe {
        type DiscriminatedEvent = ${Object.keys(flatTree)
          .map((g) => `DiscriminatedEvent.${flatTree[g].interfaceName}`)
          .join(" | ")}

        namespace DiscriminatedEvent {
          /**
           * All possible event types: https://stripe.com/docs/api/events/types
           */
          type Type = ${scrapedEvents.map((e) => `'${e.type}'`).join(" | ")};

          interface Data<T> {
            /**
             * Object containing the API resource relevant to the event. For example, an \`invoice.created\` event will have a full [invoice object](https://stripe.com/docs/api#invoice_object) as the value of the object key.
             */
            object: T

            /**
             * Object containing the names of the attributes that have changed, and their previous values (sent along only with *.updated events).
             */
            previous_attributes?: Partial<T>
          }

          ${Object.keys(flatTree)
            .map(
              (
                e
              ) => `interface ${flatTree[e].interfaceName} extends Stripe.Event {
              type: ${flatTree[e].eventType}
              data: DiscriminatedEvent.Data<${flatTree[e].objectType}>
            }`
            )
            .join("\n\n")}

        }
      }
    }
  `)
);

/**
 * Build a tree using the dot notation of the event type ("charge.succeeded")
 * to organize the events hierarchically
 *
 * @param events - List of events scraped from Stripe's docs
 */
function buildEventTree(events: StripeDocsEventScrape[]): EventTree {
  const tree: EventTree = {};

  for (const o of events) {
    let path = o.type.split(".");
    let parentNode: EventTree = tree;

    for (let i = 0; i < path.length; i++) {
      const isLeaf = i === path.length - 1;

      let childNode = parentNode[path[i]];

      if (!childNode) {
        parentNode[path[i]] = {
          _isLeaf: isLeaf,
          _objectTypes: isLeaf ? o.objectTypes : [],
        } as EventTree;
      }

      parentNode = parentNode[path[i]] as EventTree;
    }
  }

  return tree;
}

/**
 * Flatten the event tree grouping by common event parent paths
 *
 * @param tree - Hierarchical tree of events
 * @param paths - Parent path(s)
 */
function buildFlatEventTree(tree: EventTree, paths: string[] = []): FlatTree {
  const flatTree: FlatTree = {};
  const leafNames: string[] = [];
  let objectTypes: string[] = [];

  for (const key in tree) {
    const o = tree[key] as EventTree;

    if (o._isLeaf) {
      leafNames.push(key);
      objectTypes = o._objectTypes || [];
    } else {
      Object.assign(
        flatTree,
        buildFlatEventTree(tree[key] as EventTree, [...paths, key])
      );
    }
  }

  if (leafNames.length) {
    const eventPrefix = paths.join(".");

    flatTree[eventPrefix] = {
      objectType: (objectTypes.length ? objectTypes : [paths[0]])
        .map((o: string) =>
          translateObjectDescriptionToTypeScriptType(o, paths)
        )
        .join(" | "),
      eventType: leafNames
        .map((t: string) => `'${eventPrefix}.${t}'`)
        .join(" | "),
      interfaceName: `${paths.map((p) => titleCase(p)).join("")}Event`,
    };
  }

  return flatTree;
}

/**
 * Builds a tree of of typing files in the `stripe` library
 */
async function buildTypingFilesTree(
  paths?: string[],
  dirPath: string = TYPES_DIR
): Promise<TypingTree> {
  const tree: TypingTree = {};

  if (!paths) {
    paths = await fs.promises.readdir(dirPath);
  }

  for (const p of paths) {
    if (p.endsWith(".ts")) {
      tree[p] = null;
    }
    // Rudimentary check to make sure the path is a directory
    else if (p.indexOf(".") === -1) {
      const nextPath = `${dirPath}/${p}`;
      tree[p] = await buildTypingFilesTree(
        await fs.promises.readdir(nextPath),
        nextPath
      );
    }
  }

  return tree;
}

function format(content: string) {
  return prettier.format(content, { parser: "typescript" });
}

/**
 * Gets full event type list from the Open API spec
 */
async function getOpenApiEventTypeList(): Promise<string[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json"
  );
  const data = await res.json();

  const events: string[] =
    data.paths["/v1/webhook_endpoints"].post.requestBody.content[
      "application/x-www-form-urlencoded"
    ].schema.properties.enabled_events.items.enum;

  // Remove wildcard
  const wildcardIndex = events.findIndex((e) => e === "*");
  if (wildcardIndex !== -1) {
    events.splice(wildcardIndex, 1);
  }

  return events;
}

/**
 * Returns the `object` TypeScript type used by the Stripe client.
 *
 * Examples:
 *  - ("bank account") => Stripe.BankAccount
 *  - ("\"application\"") => "\"application\""
 *  - ("portal configuration", ["billing_portal", "configuration"]) => "Stripe.BillingPortal.Configuration"
 *  - ("issuing authorization", ["issuing_authorization"]) => "Stripe.Issuing.Authorization"
 *
 * @param objectDescription The object type description string scraped from Stripe's docs
 * @param paths Parent path for the event. For example, for the event, "account.application.authorized", ["account", "application"] is the path
 */
function translateObjectDescriptionToTypeScriptType(
  objectDescription: string,
  paths: string[] = []
): string {
  // The event `object` type is a string, for example "application"
  if (objectDescription.match(/^"/)) {
    return objectDescription;
  }
  // There are issues finding the typings file due to pluralization
  else if (objectDescription === "capability") {
    return "Stripe.Capability";
  }

  // The "issuing" event naming pattern is inconsistent, uses underscore instead of dot for separator
  if (objectDescription.match(/^issuing/i)) {
    objectDescription = "issuing";
    paths = paths[0].split("_");
  }

  function traverseTypings(
    typings = typingsTree,
    maybeType = objectDescription.replace(/\s+/g, ""),
    typeParents: string[] = []
  ): string {
    for (const file of Object.keys(typings)) {
      const fileRegex = new RegExp(`^(${maybeType})(s|es|)?\.d\.ts$`, "i");
      const fileMatch = file.match(fileRegex);

      if (fileMatch) {
        return `Stripe${
          typeParents?.length ? `.${typeParents.join(".")}` : ""
        }.${fileMatch[1]}`;
      } else {
        const dirRegex = new RegExp(`^(${paths[0].replace(/_/g, "")})$`, "i");
        const dirMatch = file.match(dirRegex);

        if (dirMatch) {
          return traverseTypings(typings[file], paths[1].replace(/_/g, ""), [
            ...typeParents,
            file,
          ]);
        }
      }
    }
    return "Stripe.Event.Data";
  }

  return traverseTypings();
}

/**
 * Scrape all event types from the Stripe's API docs
 */
async function scrapeEvents(): Promise<StripeDocsEventScrape[]> {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto("https://stripe.com/docs/api/events/types");

  // Parse DOM for event types
  const events: StripeDocsEventScrape[] = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("#event_types li.method-list-item"),
      (element) => {
        const detailElement = element.querySelector(
          ".method-list-item-label-details"
        );
        let objectTypes: string[] = [];

        if (detailElement) {
          objectTypes = Array.from(
            detailElement.querySelectorAll(".docs-link"),
            (e) => e.textContent
          ) as string[];

          if (!objectTypes.length) {
            // If no links were found, attempt to find string value enclosed in quotes
            const stringTypes = detailElement.textContent?.match(/"(.*?)"/g);
            if (stringTypes?.length) {
              objectTypes.push(...stringTypes);
            }
          }
        }

        return {
          type:
            element.querySelector(".method-list-item-label-name")
              ?.textContent || "",
          objectTypes,
        };
      }
    )
  );

  await browser.close();

  return events;
}

function titleCase(str: string) {
  return _.upperFirst(_.camelCase(str));
}
