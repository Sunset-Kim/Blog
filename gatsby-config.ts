import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "민우의개발블로그",
    siteUrl: `https://www.yourdomain.tld`,
  },
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-image", "gatsby-plugin-sharp"],
};

export default config;
