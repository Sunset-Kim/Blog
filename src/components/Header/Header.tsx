import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return <CONTAINER>{children}</CONTAINER>;
};

const CONTAINER = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
`;

export default Header;
