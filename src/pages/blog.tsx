import BlogPage from "@components/BlogPage";
import { graphql } from "gatsby";

export default BlogPage;

export const blogListQuery = graphql`{
  allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
    edges {
      node {
        excerpt(pruneLength: 200, format: PLAIN, truncate: true)
        id
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD", locale: "ko")
          tags
          image {
            childImageSharp {
              gatsbyImageData(width: 200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
            }
          }
        }
      }
    }
  }
}`;
