import React, { useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import sdk from "@stackblitz/sdk";
import clsx from "clsx";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    sdk.embedProjectId("demo", siteConfig.projectName, {
      forceEmbedLayout: true,
      openFile: "index.ts",
      view: "editor",
      hideExplorer: false,
      height: 700,
    });
  }, []);

  return (
    <Layout>
      <header className={clsx("hero hero--primary", styles.hero)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.tagline}</h1>
          <p className="hero__subtitle">
            Strongly type the <code>event.type</code> and{" "}
            <code>event.data.object</code> fields for better developer
            experience and implementation.
          </p>
          <iframe
            src={`https://ghbtns.com/github-btn.html?user=${siteConfig.organizationName}&repo=${siteConfig.projectName}&type=star&count=true&size=large`}
            width="170"
            height="30"
            title="GitHub"
          />
        </div>
      </header>
      <main>
        <div
          className={clsx("container margin-top--xl", styles.installCommandRow)}
        >
          <code className={clsx("padding--sm", styles.installCommand)}>
            npm install {siteConfig.projectName}
          </code>
        </div>
        <div className="container margin-top--lg margin-bottom--xl">
          <div className={styles.tryItOutRow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={59.116}
              height={45.358}
              className={styles.tryItOutArrow}
            >
              <path
                d="M41.692 14.657 50.756 1.12h-1.295l7.216 11.906 1.03 1.7c.5.825 1.798.072 1.296-.756L51.787 2.063l-1.03-1.7c-.305-.502-.984-.466-1.296 0L40.396 13.9c-.538.805.76 1.556 1.296.757Z"
                className={styles.tryItOutArrowPath}
              />
              <path
                d="M.716 45.06c9.372-1.04 18.032-6.727 22.516-15.066 2.283-4.248 3.788-9.904 1.056-14.314-2.293-3.703-7.184-5.686-10.984-2.945C9.344 15.592 8.9 20.83 9.94 25.223c.634 2.676 1.653 5.291 2.677 7.84.87 2.167 1.845 4.318 3.176 6.246 2.619 3.792 6.562 6.274 11.281 6.033 4.954-.254 9.335-3.01 12.428-6.773 3.77-4.588 6.069-10.375 7.902-15.964 2.075-6.33 3.33-12.9 3.827-19.54.072-.962-1.428-.958-1.5 0-.745 9.932-3.204 20.047-7.775 28.937-2.078 4.04-4.877 7.938-8.964 10.128-3.87 2.073-8.728 2.498-12.48-.063-3.468-2.367-5.324-6.476-6.789-10.266-1.634-4.23-3.819-9.236-2.348-13.803.638-1.98 2.006-3.923 3.997-4.713 2.07-.82 4.328-.157 5.975 1.243 3.895 3.31 3.27 8.88 1.384 13.102C18.849 36.313 10.136 42.515.716 43.56c-.95.106-.96 1.607 0 1.5Z"
                className={styles.tryItOutArrowPath}
              />
            </svg>
            <div className={styles.tryItOutText}>Try it out!</div>
          </div>
          <div id="demo" />
        </div>
      </main>
    </Layout>
  );
}
