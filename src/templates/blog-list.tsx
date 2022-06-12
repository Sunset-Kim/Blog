import React from "react";
import { graphql } from "gatsby";
import Layout from "@components/layouts/Layout";
import { Link } from "gatsby";

function BlogList({ data, ...rest }) {
  const posts = data.allMarkdownRemark.edges;
  const {
    pageContext: { currentPage, numPages: total },
  } = rest;

  const 페이지생성 = () => {
    const result = [];

    for (let i = currentPage - 3; result.length < 5 && total >= i; i++) {
      if (i <= 0) continue;
      const pageInfo = {
        path: i === 1 ? `/blog` : `/blog/${i}`,
        pageNumber: i,
      };
      result.push(pageInfo);
    }

    return result;
  };

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
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(sort: { fields: [frontmatter___datePublished], order: DESC }, limit: $limit, skip: $skip) {
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
