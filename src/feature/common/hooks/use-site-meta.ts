import { graphql, useStaticQuery } from "gatsby";

export const useSiteMeta = ({ pageTitle }: { pageTitle?: string }) => {
  const { site } = useStaticQuery<{
    site: {
      siteMetadata: {
        title: string;
        description: string;
      };
    };
  }>(graphql`
    query metaQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const { title, description } = site?.siteMetadata;

  return {
    title: pageTitle ? `${title} | ${pageTitle}` : title,
    description,
  };
};
