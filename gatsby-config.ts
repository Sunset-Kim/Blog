import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "김민우 블로그",
    description: "김민우씨의 개발여정, 개발로그",
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
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
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/contents/blog`,
      },
    },

    `gatsby-plugin-web-font-loader`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-emotion-dark-mode`,
      options: {
        light: {
          blue: {
            300: "#8ecae6",
            400: "#219ebc",
            500: "#126782",
            600: "#023047",
          },
          orange: {
            300: "#ffb703",
            400: "#fd9e02",
            500: "#fb8500",
            600: "#fb9017",
          },
        },
        dark: {
          blue: {
            300: "#8ecae6",
            400: "#219ebc",
            500: "#126782",
            600: "#023047",
          },
          orange: {
            300: "#ffb703",
            400: "#fd9e02",
            500: "#fb8500",
            600: "#fb9017",
          },
        },
      },
    },
  ],
};

export default config;
