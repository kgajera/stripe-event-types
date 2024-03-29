// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "stripe-event-types",
  tagline: "TypeScript typings for Stripe webhook events",
  url: "https://kgajera.github.io",
  baseUrl: "/stripe-event-types/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "kgajera", // Usually your GitHub org/user name.
  projectName: "stripe-event-types", // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  customFields: {
    installCommand: "npm install stripe-event-types",
    stackBlitzId: "stripe-event-types",
    stackBlitzEmbedOptions: { view: "editor" },
    subheading:
      "Strongly type the <code>event.type</code> and <code>event.data.object</code> fields for better developer experience and implementation.",
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "stripe-event-types",
        logo: {
          alt: "stripe-event-types Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            position: "right",
            label: "Docs",
          },
          {
            href: "https://github.com/kgajera/stripe-event-types",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        links: [
          {
            label: "GitHub",
            href: "https://github.com/kgajera/stripe-event-types",
          },
        ],
        copyright: "Built with Docusaurus.",
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
