import Comments from "@components/Comments/Comments";
import Layout from "@components/layouts/Layout";
import { graphql, Link } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { S } from "./blog-post.styles";
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
      <S.ColTwo>
        <S.Contents>
          <div id="post" dangerouslySetInnerHTML={{ __html: post.html }} />
          <S.PageContainer>
            <S.Page>
              {pagecontext.previous && (
                <>
                  <Link to={`/blog${pagecontext.previous.fields.slug}`}>
                    <span>이전페이지</span>
                    <h5>{pagecontext.previous.frontmatter.title}</h5>
                  </Link>
                </>
              )}
            </S.Page>

            <S.Page className="next">
              {pagecontext.next && (
                <Link to={`/blog${pagecontext.next.fields.slug}`}>
                  <span>다음페이지</span>
                  <h5>{pagecontext.next.frontmatter.title}</h5>
                </Link>
              )}
            </S.Page>
          </S.PageContainer>
          <div>
            <Comments pathName={pagecontext.slug} />
          </div>
        </S.Contents>
        <Toc tableOfContents={post.tableOfContents}></Toc>
      </S.ColTwo>
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
