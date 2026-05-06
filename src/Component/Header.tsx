import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const menuItems = [
  { path: "/", label: "Home" },
];

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-top">
        <NavLink to="/" className="header-login">
          로그인
        </NavLink>
      </div>

      <div className="header-main">
        <NavLink to="/" className="header-logo">
          ITLOC
        </NavLink>

        <nav className="header-nav" aria-label="주요 메뉴">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "header-menu active" : "header-menu"
              }
              end={item.path === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
