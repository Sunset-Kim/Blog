import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "@components/layouts/Layout";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import "@styles/code-copy-button.css";

interface BlogPostProps {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string;
        datePublished: string;
        author: string;
        image: IGatsbyImageData;
      };
      html: string;
    };
  };
}

export default function BlogPost({ data }: BlogPostProps) {
  const post = data.markdownRemark;
  const image = getImage(post.frontmatter.image);

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
}
export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        image {
          childImageSharp {
            fluid(maxWidth: 640, quality: 85) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        title
        date(formatString: "MM DD dddd,YYYY", locale: "KO")
        tags
      }
    }
  }
`;
