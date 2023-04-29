import Layout from "@components/layouts/Layout";
import styled from "@emotion/styled";
import { graphql, Link } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
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
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    line-height: 1;
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

  table {
    border: 1px solid ${({ theme }) => theme.bg[300]};
    border-collapse: collapse;

    th {
      padding: 8px 16px;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      background-color: ${({ theme }) => theme.bg[200]};
    }

    tr {
      &:nth-of-type(2n) {
        background-color: ${({ theme }) => theme.bg[100]};
      }
    }
    td {
      font-size: 14px;
      padding: 8px 16px;
      border: 1px solid ${({ theme }) => theme.bg[200]};
    }
  }

  ol,
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    background-color: aliceblue;
    padding: 1em 0;
    padding-left: 2em;
    padding-right: 1em;
    border-radius: 4px;
  }
  li {
    list-style-position: inside;
    list-style: square;
    &:not(:last-of-type) {
      margin-bottom: 0.25em;
    }
  }

  a {
    text-decoration: underline;
  }
  figure {
    img {
      width: 100%;
    }
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

  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
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
    font-size: 16px;
    margin: 0;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.bg[700]};
    margin-bottom: 4px;
  }

  a {
    border-radius: 10px;
    transition: background-color 0.2s;
    background-color: ${({ theme }) => theme.bg[100]};
    display: block;
    padding: 16px;
    text-decoration: none;

    &:hover {
      background-color: ${({ theme }) => theme.bg[200]};
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
            gatsbyImageData(width: 640, quality: 85, layout: CONSTRAINED)
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
