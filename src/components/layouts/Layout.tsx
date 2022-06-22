import Header from "@components/Header/Header";
import styled from "@emotion/styled";
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
    <WRAPPER>
      <title>
        {pageTitle} | {site.siteMetadata.title}
      </title>
      <Header>
        {site.siteMetadata.title}
        <nav>
          <ul>
            <li>
              <Link to="/blog">블로그 톺아보기</Link>
            </li>
          </ul>
        </nav>
      </Header>

      <main>
        <h1>{pageTitle}</h1>
        {children}
      </main>
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  margin: 0 auto;
  padding: 0 48px;
  min-width: 1024px;
  max-width: 1200px;
`;

export default Layout;
