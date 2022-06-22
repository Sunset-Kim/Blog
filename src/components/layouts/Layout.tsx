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
        <TITLE>{site.siteMetadata.title}</TITLE>

        <nav>
          <ul>
            <li>
              <Link to="/blog">톹아보기</Link>
            </li>
          </ul>
        </nav>
      </Header>

      <main>{children}</main>
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 0 16px;
`;

const TITLE = styled.h1`
  font-weight: 700;
  font-size: 24px;
`;

export default Layout;
