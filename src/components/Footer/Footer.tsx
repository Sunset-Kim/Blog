import styled from "@emotion/styled";
import React from "react";

const Footer = () => {
  return <WRAPPER>© 김민우 2022</WRAPPER>;
};

const WRAPPER = styled.footer`
  height: 80px;
  font-size: 14px;
  font-weight: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  border-top: 1px solid ${({ theme }) => theme.bg[300]};
`;

export default Footer;
