import BlogPage from "@/components/BlogPage";
import { graphql } from "gatsby";

export default BlogPage;

export const blogListQuery = graphql`
  {
    allMdx(sort: { frontmatter: { date: DESC } }, limit: 10) {
      edges {
        node {
          id
          fields {
            slug
          }
          excerpt(pruneLength: 200)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD", locale: "ko")
            tags
            image {
              childImageSharp {
                gatsbyImageData(width: 200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF], layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
  }
`;
