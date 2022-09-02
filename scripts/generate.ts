import { launch } from "puppeteer";
import fs from "fs";
import path from "path";
import _ from "lodash";
import prettier from "prettier";

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

/**
 * If the event type is prefixed with one these names, it
 * is a nested API/type in the Stripe client
 */
const EVENTS_WITH_API_PARENT = [
  "identity",
  "issuing",
  "radar",
  "reporting",
  "sigma",
  "terminal",
  "test_helpers",
];

/**
 * If the event type is prefixed with one these names, use the dot
 * notation of the event type to construct the Stripe client type name
 */
const EVENTS_WITH_API_EVENT_PATH = ["billing_portal", "checkout"];

(async () => {
  const events = await scrapeEvents();
  const eventTree = buildEventTree(events);
  const flatTree = buildFlatEventTree(eventTree);

  fs.writeFileSync(
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
            type Type = ${events.map((e) => `'${e.type}'`).join(" | ")};

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
})();

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
      objectType: objectTypes
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

function format(content: string) {
  return prettier.format(content, { parser: "typescript" });
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
  let parent = EVENTS_WITH_API_PARENT.includes(paths[0])
    ? `${titleCase(paths[0])}`
    : "";

  if (objectDescription.match(/^"/)) {
    // The event `object` type is a string, for example "application"
    return objectDescription;
  } else if (EVENTS_WITH_API_EVENT_PATH.includes(paths[0])) {
    // Use the dot notation of the event type to construct the TypeScript type
    return `Stripe.${paths.map((p) => titleCase(p)).join(".")}`;
  } else if (objectDescription === "invoiceitem") {
    // Inconsistent casing in event type and Stripe TypeScript type
    objectDescription = "InvoiceItem";
  } else if (objectDescription.match(/^issuing/i)) {
    // Inconsistent naming for the events that start with "issuing_" and their Stripe TypeScript type
    objectDescription = objectDescription.replace(/^issuing/i, "");
    parent = "Issuing";
  } else if (objectDescription.match(/^recipient/i)) {
    // The `Stripe.Recipient` type has been removed in v10.0.0
    return "Stripe.Event.Data";
  }

  return `Stripe.${parent.length ? `${parent}.` : ""}${titleCase(
    objectDescription
  )}`;
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
