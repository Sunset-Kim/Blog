import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "@components/layouts/Layout";
import { IGatsbyImageData } from "gatsby-plugin-image";
import styled from "@emotion/styled";
import Toc from "./Toc";

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
      tableOfContents: string;
      html: string;
    };
  };

  pageContext: PageContext;
}

export default function BlogPost(props: BlogPostProps) {
  const post = props.data.markdownRemark;
  const pagecontext = props.pageContext;

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <LAYOUT_COL_TWO>
        <CONTENTS>
          <div id="post" dangerouslySetInnerHTML={{ __html: post.html }} />
          <PAGE_CONTAINER>
            <PAGE>
              {pagecontext.previous && (
                <>
                  <Link to={`/blog${pagecontext.previous.fields.slug}`}>
                    <span>이전페이지</span>
                    <h5>{pagecontext.previous.frontmatter.title}</h5>
                  </Link>
                </>
              )}
            </PAGE>

            <PAGE className="next">
              {pagecontext.next && (
                <Link to={`/blog${pagecontext.next.fields.slug}`}>
                  <span>다음페이지</span>
                  <h5>{pagecontext.next.frontmatter.title}</h5>
                </Link>
              )}
            </PAGE>
          </PAGE_CONTAINER>
        </CONTENTS>
        <Toc tableOfContents={post.tableOfContents}></Toc>
      </LAYOUT_COL_TWO>
    </Layout>
  );
}

const LAYOUT_COL_TWO = styled.div`
  display: flex;
`;
const CONTENTS = styled.main`
  flex: 1;
  overflow-x: hidden;
  padding: 80px 40px;
  line-height: 1.5;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    margin: 1em 0;
    > a {
      fill: ${({ theme }) => theme.blue[500]};
    }
  }

  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 28px;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 20px;
  }

  p {
    margin-block-start: 1em;
    margin-block-end: 1em;
  }

  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-left: 20px;
  }
  li {
    list-style-position: inside;
    list-style: disc;
  }

  a {
    text-decoration: underline;
  }
  figcaption {
    margin: 8px 0;
    font-size: 14px;
    color: ${({ theme }) => theme.bg[600]};
    text-align: center;
    font-style: italic;
  }

  pre {
    overflow: auto;
    overflow-wrap: normal;
    white-space: pre;
  }
`;

const PAGE_CONTAINER = styled.div`
  display: flex;
  margin-top: 40px;
`;

const PAGE = styled.div`
  width: 50%;

  &.next {
    a {
      text-align: right;
    }
  }

  &:not(:last-of-type) {
    margin-right: 10px;
  }

  h5 {
    color: ${({ theme }) => theme.bg[800]};
    font-size: 18px;
    margin: 0;
  }

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.bg[700]};
    margin-bottom: 4px;
  }

  a {
    border-radius: 10px;
    transition: background-color 0.2s;
    background-color: ${({ theme }) => theme.bg[200]};
    display: block;
    padding: 16px;
    text-decoration: none;

    &:hover {
      background-color: ${({ theme }) => theme.bg[300]};
    }
  }
`;

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
      tableOfContents(maxDepth: 6)
    }
  }
`;
