import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { auth, googleProvider } from "../Utils/firebase";
import type { AuthUser } from "../services/authTokenStorage";

type CommonResponse<T = unknown> = {
  success: boolean;
  data?: T | null;
  msg?: string;
};

type LoginRegisterData = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

const LOGIN_REGISTER_PATH = "/user/login_register";

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const Login: React.FC = () => {
  const { user, setAuthSession, clearToken } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const authServerUrl = import.meta.env.VITE_AUTH_VALIDATE_URL;

      if (!authServerUrl) {
        throw new Error("VITE_AUTH_VALIDATE_URL is not configured.");
      }

      const formData = new FormData();
      formData.append("provider", firebaseUser.providerData[0]?.providerId ?? "google.com");
      formData.append("firebase_uid", firebaseUser.uid);
      formData.append("email", firebaseUser.email ?? "");
      formData.append("display_name", firebaseUser.displayName ?? "");
      formData.append("photo_url", firebaseUser.photoURL ?? "");

      const response = await fetch(joinUrl(authServerUrl, LOGIN_REGISTER_PATH), {
        method: "POST",
        body: formData,
      });
      const apiResult = (await response.json()) as CommonResponse<LoginRegisterData>;

      if (!response.ok || !apiResult.success) {
        throw new Error(apiResult.msg || `Login API failed. HTTP ${response.status}`);
      }

      if (!apiResult.data?.access_token || !apiResult.data.user) {
        throw new Error("Login API response is missing access_token or user.");
      }

      console.log("## Firebase user:", firebaseUser);
      console.log("## login_register result:", apiResult);
      setAuthSession(apiResult.data.access_token, apiResult.data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    clearToken();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Firebase Google Login Test</h1>

      {user ? (
        <div>
          <p>Logged in: {user.display_name}</p>
          <p>Email: {user.email}</p>
          {user.photo_url && (
            <img
              src={user.photo_url}
              alt="profile"
              width={80}
              style={{ borderRadius: "50%" }}
            />
          )}
          <br />
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button type="button" onClick={handleGoogleLogin}>
          Google Login
        </button>
      )}
    </div>
  );
};

export default Login;
