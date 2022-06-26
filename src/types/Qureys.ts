import { IGatsbyImageData } from "gatsby-plugin-image";

export interface BlogQuery {
  data: {
    allMarkdownRemark: {
      edges: {
        node: RenderPostList;
      }[];
    };
  };
}

export type ObjectValue<T extends object, K extends keyof T> = T[K];

export type RenderPostList = {
  id: string;
  excerpt: string;
  fields: { slug: string };
  frontmatter: {
    date: Date;
    image: { childImageSharp: IGatsbyImageData };
    tags: string[];
    title: string;
  };
};
