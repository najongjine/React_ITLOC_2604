import { useState } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "../Utils/firebase";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const mode = import.meta.env.MODE;
  const [user, setUser] = useState<User | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(`## result: \n`,result?.user)
      setUser(result.user);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  return (
   <div style={{ padding: 40 }}>
      <h1>Firebase Google 로그인 테스트</h1>

      {user ? (
        <div>
          <p>로그인됨: {user.displayName}</p>
          <p>이메일: {user.email}</p>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="profile"
              width={80}
              style={{ borderRadius: "50%" }}
            />
          )}
          <br />
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Google 로그인</button>
      )}
    </div>
  );
};

export default Login;
