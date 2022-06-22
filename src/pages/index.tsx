import * as React from "react";
import Layout from "../components/layouts/Layout";
import { graphql, Link } from "gatsby";
import "@styles/reset.css";
import "@styles/global.css";

interface BlogQuery {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string;
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
            date: Date;
            featuredImages: string;
            tags: string[];
          };
        };
      }[];
    };
  };
}

const IndexPage = ({ data }: BlogQuery) => {
  return (
    <main>
      <Layout pageTitle="홈">
        <div>
          <ul>
            {data.allMarkdownRemark.edges.map((list) => (
              <li key={list.node.id}>
                <Link to={`/blog${list.node.fields.slug}`}>
                  <h3>{list.node.frontmatter.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </main>
  );
};

export default IndexPage;

export const blogListQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            featuredImage
            date
            tags
          }
        }
      }
    }
  }
`;
