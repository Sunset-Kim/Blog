import Header from "@components/Header/Header";
import styled from "@emotion/styled";
import { Link, useStaticQuery, graphql } from "gatsby";
import React from "react";
import github from "@assets/github.png";
import Footer from "@components/Footer/Footer";

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

        <NAV>
          <ul>
            <li>
              <Link to="/blog">톺아보기</Link>
            </li>
            <li>
              <a href="https://github.com/Sunset-Kim" target="_blank">
                <img src={github} alt="김민우의깃허브" />
              </a>
            </li>
          </ul>
        </NAV>
      </Header>

      <CONTENTS>{children}</CONTENTS>
      <Footer />
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  min-height: 100vh;
  margin: 0 auto;
`;

const TITLE = styled.h1`
  position: relative;
  font-weight: 700;
  font-size: 24px;

  &::before {
    content: "";
    position: absolute;
    top: 85%;
    display: block;
    width: 120%;
    height: 3px;
  }
`;

const NAV = styled.nav`
  ul {
    display: flex;
    align-items: center;
    font-weight: 700;

    li {
      &:not(:last-of-type) {
        margin-right: 16px;
      }
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const CONTENTS = styled.div`
  min-height: calc(100vh - 73px - 80px);
  height: 100%;
  min-width: 340px;
  max-width: 1024px;
  margin: 0 auto;
`;

export default Layout;
