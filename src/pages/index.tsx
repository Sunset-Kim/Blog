import * as React from "react";
import Layout from "../components/layouts/Layout";
import { graphql, Link } from "gatsby";
import "@styles/reset.css";
import "@styles/global.css";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import styled from "@emotion/styled";

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
            tags: string[];
            image: {
              childImageSharp: {
                gatsbyImageData: IGatsbyImageData;
              };
            };
          };
        };
      }[];
    };
  };
}

const IndexPage = ({ data }: BlogQuery) => {
  console.log(data);
  return (
    <main>
      <Layout pageTitle="홈">
        <div>
          <ul>
            {data.allMarkdownRemark.edges.map((list) => {
              console.log(list.node.frontmatter.image?.childImageSharp.gatsbyImageData);
              return (
                <li key={list.node.id}>
                  <Link to={`/blog${list.node.fields.slug}`}>
                    <IMG_CONTAINER>
                      {list.node.frontmatter?.image?.childImageSharp.gatsbyImageData && (
                        <GatsbyImage
                          image={list.node.frontmatter.image.childImageSharp.gatsbyImageData}
                          alt={list.node.id}
                        />
                      )}
                    </IMG_CONTAINER>
                    <h3>{list.node.frontmatter.title}</h3>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Layout>
    </main>
  );
};

export default IndexPage;

const IMG_CONTAINER = styled.div`
  width: 75px;
  height: 75px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

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
            date
            tags
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 75)
              }
            }
          }
        }
      }
    }
  }
`;
