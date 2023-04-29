import type { GatsbyConfig } from "gatsby";

const light = {
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
  bg: {
    900: "#212529",
    800: "#343A40",
    700: "#495057",
    600: "#6C757D",
    500: "#ADB5BD",
    400: "#CED4DA",
    300: "#DEE2E6",
    200: "#E9ECEF",
    100: "#F8F9FA",
  },
};

const config: GatsbyConfig = {
  siteMetadata: {
    title: "김민우 블로그",
    description: "김민우씨의 개발여정, 개발로그",
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs-copy-button`,
          `gatsby-remark-autolink-headers`,
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
        light,
        dark: light,
      },
    },
  ],
};

export default config;
