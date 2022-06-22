import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "김민우 블로그",
    description: "김민우씨의 개발여정, 개발로그",
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/contents/blog`,
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-figure-caption`,
            options: { figureClassName: "md-figure" },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: "gatsby-remark-code-buttons",
            options: {
              buttonContainerClass: `customButtonContainerClass`,
              buttonClass: `customButtonClass`,
              svgIconClass: `customSvgIconClass`,
              tooltipText: `Copy`,
              toasterClass: `customToasterClass`,
              toasterTextClass: `customToasterTextClass`,
              toasterText: "Copied!",
              toasterDuration: 5000,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 480,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              escapeEntities: {},
            },
          },
        ],
      },
    },
    `gatsby-plugin-web-font-loader`,
    `gatsby-plugin-emotion`,
  ],
};

export default config;
