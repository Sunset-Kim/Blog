import { graphql, Link } from "gatsby";
import Layout from "@components/layouts/Layout";
import { IGatsbyImageData } from "gatsby-plugin-image";
import styled from "@emotion/styled";
import Toc, { TOC } from "./Toc";

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
    mdx: {
      frontmatter: {
        title: string;
        datePublished: string;
        author: string;
        image: IGatsbyImageData;
      };
      tableOfContents: Pick<TOC, "items">;
      html: string;
    };
  };
  pageContext: PageContext;
  children: React.ReactNode;
}

export default function BlogPost({ data, pageContext, children }: BlogPostProps) {
  const post = data.mdx;
  const pagecontext = pageContext;

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <LAYOUT_COL_TWO>
        <CONTENTS>
          <section itemProp="articleBody">{children}</section>
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
        <Toc tableOfContents={post.tableOfContents.items} />
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
    border: 1px solid;
    border-collapse: collapse;

    th {
      padding: 8px 16px;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
    }

    tr {
      &:nth-of-type(2n) {
      }
    }
    td {
      font-size: 14px;
      padding: 8px 16px;
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
    font-size: 16px;
    margin: 0;
  }

  span {
    font-size: 14px;
    font-weight: 500;

    margin-bottom: 4px;
  }

  a {
    border-radius: 10px;
    transition: background-color 0.2s;

    display: block;
    padding: 16px;
    text-decoration: none;

    &:hover {
    }
  }
`;

export const query = graphql`
  query ($slug: String) {
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        image {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, width: 640)
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
