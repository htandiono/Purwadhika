import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { clearStoredToken, getStoredToken, storeToken } from "../api/http";
import { AuthPayload, RegisterPayload, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const storedToken = getStoredToken();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((response) => {
        if (!isMounted) {
          return;
        }
        setUser(response.data ?? null);
        setToken(storedToken);
      })
      .catch(() => {
        clearStoredToken();
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: AuthPayload) => {
    const response = await authApi.login(payload);
    const authData = response.data;

    if (!authData) {
      throw new Error("Login response was empty");
    }

    storeToken(authData.token);
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authApi.register(payload);
    const authData = response.data;

    if (!authData) {
      throw new Error("Registration response was empty");
    }

    storeToken(authData.token);
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout
    }),
    [isLoading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
