import { IGatsbyImageData } from "gatsby-plugin-image";

export interface BlogQuery {
  allMarkdownRemark: {
    edges: {
      node: PostList;
    }[];
  };
}

export type PostList = {
  id: string;
  excerpt: string;
  fields: { slug: string };
  frontmatter: {
    date: string;
    image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } };
    tags: string[];
    title: string;
  };
};
