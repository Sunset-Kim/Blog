import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CONTAINER>
      <INNER>{children}</INNER>
    </CONTAINER>
  );
};

const CONTAINER = styled.header`
  display: flex;
  width: 100%;
  padding: 0 24px;
  height: 60px;
  border-bottom: 1px solid rgba(222, 226, 230, 1);
  box-shadow: 0px 0.5px 5px rgba(222, 226, 230, 0.2);
  min-width: 340px;

  @media screen and (min-width: 768px) {
    padding: 0 36px;
  }
`;

const INNER = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

export default Header;
