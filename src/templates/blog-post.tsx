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
        image_alt: string;
        image_credit_link: string;
        image_credit_text: string;
      };
      html: string;
    };
  };
}

export default function BlogPost({ data }: BlogPostProps) {
  const post = data.markdownRemark;
  const image = getImage(post.frontmatter.image);
  const isImgExist =
    post.frontmatter.image &&
    post.frontmatter.image_alt &&
    post.frontmatter.image_credit_link &&
    post.frontmatter.image_credit_text;

  return (
    <Layout pageTitle={post.frontmatter.title}>
      {isImgExist && (
        <>
          <GatsbyImage image={image} alt={post.frontmatter.image_alt} />
          <p>
            Photo Credit: <a href={post.frontmatter.image_credit_link}>{post.frontmatter.image_credit_text}</a>
          </p>
        </>
      )}

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
        featuredImage
        title
        date(formatString: "MM DD dddd,YYYY", locale: "KO")
        tags
      }
    }
  }
`;
