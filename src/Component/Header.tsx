import React from "react";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../Utils/firebase";
import "./Header.css";

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/tratot_simple", label: "타로심플" },
  { path: "/tratot_no_ai", label: "타로전문가" },
  { path: "/llm_taro_simple", label: "LLM 타로 초간단" },
];

const Header: React.FC = () => {
  const { user, clearToken } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    clearToken();
  };

  return (
    <header className="header">
      <div className="header-top">
        {user?.id ? (
          <div className="header-user">
            {user.photo_url && (
              <img src={user.photo_url} alt="" className="header-user-image" />
            )}
            <div className="header-user-info">
              <span className="header-user-name">{user.display_name}</span>
              <span className="header-user-email">{user.email}</span>
            </div>
            <button
              type="button"
              className="header-logout"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="header-login">
            로그인
          </NavLink>
        )}
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
