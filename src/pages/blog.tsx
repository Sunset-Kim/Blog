import { PageProps } from "gatsby";
import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import Layout from "../components/layouts/Layout";

interface BlogPageProps {
  data: {
    allFile: {
      nodes: {
        name: string;
      }[];
    };
  };
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  console.log(data);
  return (
    <Layout pageTitle="블로그 포스트">
      <ul>
        {data.allFile.nodes.map((node) => (
          <li key={node.name}>{node.name}</li>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query MyQuery2 {
    allFile(filter: { sourceInstanceName: { eq: "blog" } }) {
      nodes {
        name
      }
    }
  }
`;

export default BlogPage;
