import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
   title: "Mastering Solidity",
   tagline: "Belajar Solidity dari dasar hingga mahir",
   favicon: "img/sol.png",

   // Set the production url of your site here
   url: "https://ms.generasibelajar.com",
   // Set the /<baseUrl>/ pathname under which your site is served
   // For GitHub pages deployment, it is often '/<projectName>/'
   baseUrl: "/",

   // GitHub pages deployment config.
   // If you aren't using GitHub pages, you don't need these.
   organizationName: "Brave-teknologi", // Usually your GitHub org/user name.
   projectName: "belajar-solidity", // Usually your repo name.

   onBrokenLinks: "throw",
   onBrokenMarkdownLinks: "warn",

   // Even if you don't use internationalization, you can use this field to set
   // useful metadata like html lang. For example, if your site is Chinese, you
   // may want to replace "en" with "zh-Hans".
   i18n: {
      defaultLocale: "id",
      locales: ["id"],
   },

   presets: [
      [
         "classic",
         {
            docs: {
               sidebarPath: "./sidebars.ts",
               // Please change this to your repo.
               // Remove this to remove the "edit this page" links.
               editUrl:
                  "https://github.com/Brave-teknologi/belajar-solidity/edit/main",
               routeBasePath: "/",
            },
            theme: {
               customCss: "./src/css/custom.css",
            },
            gtag: {
               trackingID: "G-PTLCNENXEL",
               anonymizeIP: true,
            },
         } satisfies Preset.Options,
      ],
   ],

   themeConfig: {
      // Replace with your project's social card
      image: "img/card.png",
      navbar: {
         title: "Mastering Solidity",
         logo: {
            alt: "Mastering Solidity Logo",
            src: "img/sol.png",
         },
         items: [
            { to: "/blog", label: "Blog", position: "left" },
            {
               href: "https://github.com/Brave-teknologi/belajar-solidity",
               label: "GitHub",
               position: "right",
            },
         ],
      },
      algolia: {
         appId: "CT3U9DBRZS",
         apiKey: "1bdfd826e699f2b7bb82938dd2e66f4d",
         indexName: "ms-generasibelajar",
      },
      footer: {
         style: "dark",
         links: [
            {
               title: "Legal",
               items: [
                  {
                     label: "Privacy",
                     to: "https://generasibelajar.com/privacy",
                  },
                  {
                     label: "Terms",
                     to: "https://generasibelajar.com/terms",
                  },
               ],
            },
            {
               title: "Komunitas",
               items: [
                  {
                     label: "Discord",
                     href: "https://discordapp.com/invite/docusaurus",
                  },
                  {
                     label: "X",
                     href: "https://x.com/gen_belajar",
                  },
               ],
            },
            {
               title: "Lainnya",
               items: [
                  {
                     label: "Blog",
                     to: "/blog",
                  },
                  {
                     label: "GitHub",
                     href: "https://github.com/Brave-teknologi/belajar-solidity",
                  },
               ],
            },
         ],
         copyright: `Copyright © ${new Date().getFullYear()} Generasibelajar. Presented by Braveteknologi.`,
      },
      prism: {
         theme: prismThemes.github,
         darkTheme: prismThemes.dracula,
         additionalLanguages: ["solidity"],
      },
   } satisfies Preset.ThemeConfig,
};

export default config;
