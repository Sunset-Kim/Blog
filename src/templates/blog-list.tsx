import React from "react";
import { graphql } from "gatsby";
import Layout from "@components/layouts/Layout";
import { Link } from "gatsby";

function BlogList({ data, ...rest }) {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout pageTitle="아아">
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <div key={node.id}>
            <Link to={`/blog${node.fields.slug}`}>{title}</Link>
          </div>
        );
      })}
      <div>
        <ul style={{ display: "flex" }}>
          {페이지생성().map((page) => (
            <li>
              <Link
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50px",
                  height: "50px",
                  background: page.pageNumber === currentPage ? "crimson" : "white",
                }}
                to={page.path}
              >
                {page.pageNumber}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
export default BlogList;

export const blogListQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: $limit, skip: $skip) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
