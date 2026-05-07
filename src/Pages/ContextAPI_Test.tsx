import React from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * clearToken : 로그아웃
 */
const ContextAPI_Test: React.FC = () => {
  const { token, isAuthenticated, setToken, clearToken, checkToken, authMessage } = useAuth();

  // 로그인 하는 코드
  const handleLoginTest = () => {
    const serverToken = "server-token-example";
    setToken(serverToken);
  };

  // 로그인 만료 체크 코드
  const handleCheckToken = async () => {
    const result = await checkToken();

    alert(result.success ? "token ok" : `token invalid: ${result.msg}`);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Context API Test</h1>

      <p>isAuthenticated: {String(isAuthenticated)}</p>
      <p>token: {token ?? "none"}</p>
      <p>authMessage: {authMessage || "none"}</p>

      <button type="button" onClick={handleLoginTest}>
        test login
      </button>

      <button type="button" onClick={handleCheckToken} style={{ marginLeft: 8 }}>
        check token
      </button>

      <button type="button" onClick={clearToken} style={{ marginLeft: 8 }}>
        logout
      </button>
    </main>
  );
};

export default ContextAPI_Test;
