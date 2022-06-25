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
        <TITLE>
          <Link to="/">{site.siteMetadata.title}</Link>
        </TITLE>

        <nav>
          <ul>
            <li>
              <Link to="/blog">톺아보기</Link>
            </li>
          </ul>
        </nav>
      </Header>

      <CONTENTS>{children}</CONTENTS>
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  margin: 0 auto;
`;

const TITLE = styled.h1`
  position: relative;
  font-weight: 700;
  font-size: 24px;

  &::before {
    content: "";
    position: absolute;
    top: 100%;
    display: block;
    width: 110%;
    height: 3px;
    background-color: ${(props) => props.theme.blue[300]};
  }
`;

const CONTENTS = styled.main`
  min-width: 340px;
  max-width: 1024px;
  padding: 24px 16px;

  @media screen and (min-width: 768px) {
    padding: 36px;
  }
`;

export default Layout;
