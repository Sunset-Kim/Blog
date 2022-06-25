import * as React from "react";
import Layout from "../components/layouts/Layout";
import { graphql, Link } from "gatsby";
import "@styles/reset.css";
import "@styles/global.css";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import styled from "@emotion/styled";
import PostList from "@components/PostList";

interface BlogQuery {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string;
          excerpt: string;
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
            date: string;
            tags: string[];
            image: {
              childImageSharp: IGatsbyImageData;
            };
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
            {data.allMarkdownRemark.edges.map((list) => {
              const { frontmatter, id, fields, excerpt } = list.node;
              const { title, date } = frontmatter;
              const { slug } = fields;
              const image = getImage(list.node.frontmatter.image?.childImageSharp);

              return <PostList key={id} title={title} date={date} contents={excerpt} slug={slug} image={image} />;
            })}
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
          excerpt(pruneLength: 200, format: PLAIN, truncate: true)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD dddd", locale: "ko")
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
