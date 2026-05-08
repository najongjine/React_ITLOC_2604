import React from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * 그러면 로그인, 로그아웃 이거 사용하려면
쉽게 말하면 어떤 코드만 복붙 하면되?
->
쉽게 말하면, 다른 페이지/컴포넌트에서 이거만 쓰면 됩니다.

import { useAuth } from "../contexts/AuthContext";

const {
  token,
  user,
  isAuthenticated,
  setAuthSession,
  clearToken,
} = useAuth();

// 로그인 성공 후
setAuthSession(access_token, user);

// 로그아웃
clearToken();

// 현재 로그인 정보
token;
user;
isAuthenticated;

 */
const codeBlockStyle: React.CSSProperties = {
  maxWidth: 900,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#f7f7f7",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const ContextAPI_Test: React.FC = () => {
  const { token, user, isAuthenticated, loadToken, clearToken, checkToken, authMessage } = useAuth();

  const handleCheckToken = async () => {
    const result = await checkToken();

    alert(result.success ? "token ok" : `token invalid: ${result.msg}`);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Context API Test</h1>

      <p>isAuthenticated: {String(isAuthenticated)}</p>
      <p>authMessage: {authMessage || "none"}</p>

      <section style={{ marginTop: 24 }}>
        <h2>access_token</h2>
        <pre style={{ ...codeBlockStyle, wordBreak: "break-all" }}>{token ?? "none"}</pre>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>user</h2>
        <pre style={codeBlockStyle}>{user ? JSON.stringify(user, null, 2) : "none"}</pre>
      </section>

      <button type="button" onClick={loadToken}>
        reload storage
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
