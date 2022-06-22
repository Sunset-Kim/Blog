import React, { PropsWithChildren } from "react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return <header>{children}</header>;
};

export default Header;
