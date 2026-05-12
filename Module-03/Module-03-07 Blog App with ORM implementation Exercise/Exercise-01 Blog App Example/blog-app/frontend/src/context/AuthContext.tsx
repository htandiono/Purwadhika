import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextValue {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): User | null {
  const storedUser = localStorage.getItem("blogUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    localStorage.removeItem("blogUser");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("blogToken")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStoredUser());

  function login(nextToken: string, user: User) {
    localStorage.setItem("blogToken", nextToken);
    localStorage.setItem("blogUser", JSON.stringify(user));
    setToken(nextToken);
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem("blogToken");
    localStorage.removeItem("blogUser");
    setToken(null);
    setCurrentUser(null);
  }

  function updateCurrentUser(user: User) {
    localStorage.setItem("blogUser", JSON.stringify(user));
    setCurrentUser(user);
  }

  const value = useMemo(
    () => ({
      currentUser,
      token,
      isAuthenticated: Boolean(token && currentUser),
      login,
      logout,
      updateCurrentUser
    }),
    [currentUser, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
