import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "민우의개발블로그",
    siteUrl: `https://www.yourdomain.tld`,
    description: "너도 한번 당해봐",
    since: 2012,
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: "gatsby-remark-code-buttons",
            options: {
              // Optional button container class name. Defaults
              // to 'gatsby-code-button-container'.
              buttonContainerClass: `customButtonContainerClass`,
              // Optional button class name. Defaults to 'gatsby-code-button'.
              buttonClass: `customButtonClass`,
              // Optional svg icon class name. Defaults to 'gatsby-code-button-icon'.
              svgIconClass: `customSvgIconClass`,
              // Optional svg icon. Defaults to svg string and can be
              // replaced with any other valid svg. Use custom classes
              // in the svg string and skip `iconClass` option.
              // Optional tooltip text. Defaults to ''.
              tooltipText: `Copy`,
              // Optional toaster class name. Defaults to ''.
              toasterClass: `customToasterClass`,
              // Optional toaster text class name. Defaults to ''.
              toasterTextClass: `customToasterTextClass`,
              // Optional toaster text. Defaults to ''.
              toasterText: "복사되었습니다!",
              // Optional toaster duration. Defaults to 3500.
              toasterDuration: 5000,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: false,
              escapeEntities: {},
            },
          },
        ],
      },
    },
  ],
};

export default config;
