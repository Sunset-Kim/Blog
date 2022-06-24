import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return <CONTAINER>{children}</CONTAINER>;
};

const CONTAINER = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  box-shadow: 0px 0.5px 2px rgba(0, 0, 0, 0.15);

  @media screen and (min-width: 768px) {
    padding: 24px 36px;
  }
`;

export default Header;
