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
        path: `${__dirname}/contents/blog`,
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
              buttonContainerClass: `customButtonContainerClass`,
              buttonClass: `customButtonClass`,
              svgIconClass: `customSvgIconClass`,
              tooltipText: `Copy`,
              toasterClass: `customToasterClass`,
              toasterTextClass: `customToasterTextClass`,
              toasterText: "복사되었습니다!",
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
              showLineNumbers: false,
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
