import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "@components/layouts/Layout";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import "@styles/code-copy-button.css";
import styled from "@emotion/styled";

type Page = { fields: { slug: string }; frontmatter: { date: string; title: string } };
type PageContext = {
  date: string;
  next: Page | null;
  previous: Page | null;
  slug: string;
  title: string;
};
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
  pageContext: PageContext;
}

export default function BlogPost(props: BlogPostProps) {
  const post = props.data.markdownRemark;
  const pagecontext = props.pageContext;

  console.log(pagecontext);

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <CONTENTS>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </CONTENTS>
      <PAGE>
        {pagecontext.next && (
          <>
            <Link to={`/blog${pagecontext.next.fields.slug}`}>{pagecontext.next.frontmatter.title}</Link>
          </>
        )}
        {pagecontext.previous && (
          <>
            <Link to={`/blog${pagecontext.previous.fields.slug}`}>{pagecontext.previous.frontmatter.title}</Link>
          </>
        )}
      </PAGE>
    </Layout>
  );
}

const CONTENTS = styled.main`
  figcaption {
    text-align: center;
    font-style: italic;
  }
`;

const PAGE = styled.div``;

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
