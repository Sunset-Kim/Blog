import Footer from "@/components/Footer/Footer";
import { useSiteMeta } from "@/feature/common/hooks";
import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import { GlobalStyles } from "twin.macro";

interface WithHeaderProps extends PropsWithChildren {
  header: React.ReactNode;
  pageTitle: string;
}

export const WithHeader = ({ pageTitle, header, children }: WithHeaderProps) => {
  const { title, description } = useSiteMeta({ pageTitle });

  return (
    <WRAPPER>
      <title>{title}</title>
      <GlobalStyles />

      <header>{header}</header>

      <CONTENTS>{children}</CONTENTS>
      <Footer />
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  min-height: 100vh;
  margin: 0 auto;
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
