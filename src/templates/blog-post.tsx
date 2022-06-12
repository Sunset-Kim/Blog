import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "@components/layouts/Layout";

interface BlogPostProps {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string;
        datePublished: string;
        author: string;
      };
      html: string;
    };
  };
}

export default function BlogPost({ data }: BlogPostProps) {
  const post = data.markdownRemark;
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
        title
        datePublished(formatString: "MM DD dddd,YYYY", locale: "ko")
        author
      }
    }
  }
`;
