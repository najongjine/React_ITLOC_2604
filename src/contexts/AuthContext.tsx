import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { validateAuthToken, type ApiResponse } from "../services/authApi";
import {
  getStoredAuthUser,
  getStoredAuthToken,
  removeStoredAuthSession,
  removeStoredAuthUser,
  saveStoredAuthUser,
  saveStoredAuthToken,
  type AuthUser,
} from "../services/authTokenStorage";

type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  authMessage: string;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setAuthSession: (token: string, user: AuthUser) => void;
  getToken: () => string | null;
  loadToken: () => string | null;
  clearToken: () => void;
  checkToken: () => Promise<ApiResponse>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => getStoredAuthToken());
  const [user, setUserState] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [status, setStatus] = useState<AuthStatus>(() =>
    getStoredAuthToken() ? "authenticated" : "unauthenticated"
  );
  const [authMessage, setAuthMessage] = useState("");

  const setToken = useCallback((nextToken: string) => {
    saveStoredAuthToken(nextToken);
    removeStoredAuthUser();
    setTokenState(nextToken);
    setUserState(null);
    setStatus("authenticated");
    setAuthMessage("");
  }, []);

  const setAuthSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    saveStoredAuthToken(nextToken);
    saveStoredAuthUser(nextUser);
    setTokenState(nextToken);
    setUserState(nextUser);
    setStatus("authenticated");
    setAuthMessage("");
  }, []);

  const getToken = useCallback(() => {
    return token;
  }, [token]);

  const loadToken = useCallback(() => {
    const storedToken = getStoredAuthToken();
    const storedUser = getStoredAuthUser();

    setTokenState(storedToken);
    setUserState(storedUser);
    setStatus(storedToken ? "authenticated" : "unauthenticated");

    return storedToken;
  }, []);

  const clearToken = useCallback(() => {
    removeStoredAuthSession();
    setTokenState(null);
    setUserState(null);
    setStatus("unauthenticated");
  }, []);

  const checkToken = useCallback(async () => {
    const currentToken = getStoredAuthToken();

    setStatus("checking");
    const result = await validateAuthToken(currentToken);

    if (result.success) {
      setTokenState(currentToken);
      setUserState(getStoredAuthUser());
      setStatus("authenticated");
      setAuthMessage("");
      return result;
    }

    removeStoredAuthSession();
    setTokenState(null);
    setUserState(null);
    setStatus("unauthenticated");
    setAuthMessage(result.msg);

    return result;
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      authMessage,
      isAuthenticated: status === "authenticated" && Boolean(token),
      setToken,
      setAuthSession,
      getToken,
      loadToken,
      clearToken,
      checkToken,
    }),
    [
      authMessage,
      checkToken,
      clearToken,
      getToken,
      loadToken,
      setAuthSession,
      setToken,
      status,
      token,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
