import { useState } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "../Utils/firebase";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const mode = import.meta.env.MODE;
  const [user, setUser] = useState<User | null>(null);

  // 구글 로그인 팝업 띄우는 놈
  /*
  구글 로그인을 하면, 구글 회사에 로그인 한것과 같은 효과가 나오고
  구글 회사는 우리가 뭘 원하는지 모르니 그냥 다 줘요
  그러면 우리 입장에선,
  providerId, uid, displayName, email
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(`## result: \n`,result?.user)
      setUser(result.user);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 로그아웃 기능 껍데기 인터페이스
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
