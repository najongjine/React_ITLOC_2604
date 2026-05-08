const AUTH_TOKEN_STORAGE_KEY = "authToken";
const AUTH_USER_STORAGE_KEY = "authUser";

export type AuthUser = {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  provider: string;
  role: string;
  status: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredAuthToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getStoredAuthUser(): AuthUser | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function saveStoredAuthToken(token: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function saveStoredAuthUser(user: AuthUser) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function removeStoredAuthToken() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function removeStoredAuthUser() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function removeStoredAuthSession() {
  removeStoredAuthToken();
  removeStoredAuthUser();
}
