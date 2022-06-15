import { graphql, Link } from "gatsby";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";
import React from "react";

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

const blog = ({ data }: BlogQuery) => {
  return (
    <div>
      <ul>
        {data.allMarkdownRemark.edges.map((list) => (
          <li key={list.node.id}>
            <Link to={`/blog${list.node.fields.slug}`}>
              <GatsbyImage src={list.node.frontmatter.featuredImages} alt={list.node.frontmatter.title} />
              <h3>{list.node.frontmatter.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default blog;

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
