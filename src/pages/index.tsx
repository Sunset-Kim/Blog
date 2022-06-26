import * as React from "react";
import Layout from "../components/layouts/Layout";
import { graphql } from "gatsby";
import { BlogQuery } from "types/Qureys";
import "@styles/reset.css";
import "@styles/global.css";
import PostList from "@components/PostList";
import styled from "@emotion/styled";
import recent from "@assets/recent.png";

const IndexPage = ({ data }: BlogQuery) => {
  return (
    <Layout pageTitle="홈">
      <MAIN>
        <TITLE>
          <img src={recent} alt="최근글" />
          최근 글
        </TITLE>
        <ul>
          {data.allMarkdownRemark.edges.map((list) => {
            return <PostList key={list.node.id} renderPost={list.node} />;
          })}
        </ul>
      </MAIN>
    </Layout>
  );
};

export default IndexPage;

const MAIN = styled.main`
  padding: 80px 40px;
`;

const TITLE = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 60px;

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

export const blogListQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 10) {
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
