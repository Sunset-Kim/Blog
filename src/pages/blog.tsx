import { PageProps } from "gatsby";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";
import Layout from "../components/layouts/Layout";

interface FrontMatter {
  author: string;
  datePublished: string;
  title: string;
}

interface MDNode {
  frontmatter: FrontMatter;
  id: string;
  html: string;
  parent: {
    modifiedTime: string;
  };
}
interface BlogPageProps {
  data: {
    allMarkdownRemark: {
      nodes: MDNode[];
    };
  };
  extensions: {};
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  return (
    <Layout pageTitle="블로그 포스트">
      <ul>
        {data.allMarkdownRemark.nodes.map((node) => (
          <article key={node.id}>
            <h2>{node.frontmatter.title}</h2>
            <p>Posted: {node.frontmatter.datePublished}</p>
            <div dangerouslySetInnerHTML={{ __html: node.html }} />
          </article>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: frontmatter___datePublished, order: DESC }) {
      nodes {
        id
        frontmatter {
          title
          datePublished(formatString: "MMMM DD, YYYY")
        }
        html
      }
    }
  }
`;

export default BlogPage;
