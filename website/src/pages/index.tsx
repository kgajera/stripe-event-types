import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import { StackBlitzEmbed } from "../components/StackBlitzEmbed";
import { TryItOutArrow } from "../components/TryItOutArrow";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <header className={clsx("hero hero--primary", styles.hero)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.tagline}</h1>
          <p
            className="hero__subtitle"
            // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: siteConfig.customFields.subheading,
            }}
          />
          <div className={styles.heroButtons}>
            <Link className="button button--lg button--secondary" to="/docs">
              Docs
            </Link>
            <Link
              className="button button--lg button--outline button--secondary"
              href="#demo"
            >
              Try it out
            </Link>
            <iframe
              className={styles.githubButton}
              src={`https://ghbtns.com/github-btn.html?user=${siteConfig.organizationName}&repo=${siteConfig.projectName}&type=star&count=true&size=large`}
              width="170"
              height="30"
              title="GitHub"
            />
          </div>
        </div>
      </header>
      <main>
        <div
          className={clsx(
            "container margin-vert--xl",
            styles.installCommandRow
          )}
        >
          <code className={clsx("padding--sm", styles.installCommand)}>
            {siteConfig.customFields.installCommand}
          </code>
        </div>
        <div className="container margin-top--lg margin-bottom--xl">
          <div className={styles.tryItOutRow}>
            <TryItOutArrow />
            <div className={styles.tryItOutText}>Try it out!</div>
          </div>
          <StackBlitzEmbed
            id="demo"
            projectId={siteConfig.customFields.stackBlitzId}
            options={siteConfig.customFields.stackBlitzEmbedOptions}
          />
        </div>
      </main>
    </Layout>
  );
}
