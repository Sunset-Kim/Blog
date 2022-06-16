import { Link, useStaticQuery, graphql } from "gatsby";
import React from "react";

interface LayoutProps {
  pageTitle: string;
}

const Layout: React.FC<LayoutProps & React.PropsWithChildren> = ({ pageTitle, children }) => {
  const { site } = useStaticQuery(graphql`
    query MyQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  return (
    <div>
      <title>
        {pageTitle} | {site.siteMetadata.title}
      </title>
      <header>{site.siteMetadata.title}</header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1>{pageTitle}</h1>
        {children}
      </main>
    </div>
  );
};

export default Layout;
