import * as React from "react";
import Layout from "../components/layouts/Layout";
import { graphql, Link } from "gatsby";
import { BlogQuery } from "types/Qureys";
import "@styles/reset.css";
import "@styles/global.css";
import { getImage, IGatsbyImageData } from "gatsby-plugin-image";
import PostList from "@components/PostList";

const IndexPage = ({ data }: BlogQuery) => {
  return (
    <main>
      <Layout pageTitle="홈">
        <main>
          <ul>
            {data.allMarkdownRemark.edges.map((list) => {
              return <PostList key={list.node.id} renderPost={list.node} />;
            })}
          </ul>
        </main>
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
          excerpt(pruneLength: 200, format: PLAIN, truncate: true)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD", locale: "ko")
            tags
            image {
              childImageSharp {
                gatsbyImageData(width: 200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
              }
            }
          }
        }
      }
    }
  }
`;
