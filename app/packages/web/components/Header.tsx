import React from "react";
import Progress from "./Progress";
import PACKAGE from "../package.json";

export const Header = () => {
  return (
    <nav className="navbar is-dark" aria-label="main navigation">
      <div className="navbar-brand">
        <div className="navbar-item">{PACKAGE.name} v{PACKAGE.version}</div>
      </div>
    </nav>
  );
};
export default Header;
