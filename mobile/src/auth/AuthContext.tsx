import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";
import { apiMe, User } from "./library";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;

  signIn: (newToken: string, newUser?: User | null) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadToken = async () => {
      console.log("[Auth] loadToken: start");
      try {
        // ✅ Failsafe: if secure storage hangs, unblock UI anyway
        const timeout = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 4000)
        );

        const saved = await Promise.race([
          getToken() as Promise<string | null | undefined>,
          timeout,
        ]);

        console.log(
          "[Auth] loadToken: storage result =",
          saved ? "TOKEN" : String(saved)
        );

        if (!mounted) return;

        if (saved !== null && saved !== undefined) {
          setTokenState(saved);
        } else {
          setTokenState(null);
        }
      } catch (e) {
        console.log("[Auth] loadToken: ERROR", e);
        if (!mounted) return;
        setTokenState(null);
      } finally {
        console.log("[Auth] loadToken: done -> isLoading false");
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadToken();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshMe = async () => {
    if (!token) return;

    try {
      console.log("[Auth] refreshMe: start");
      const me = await apiMe(token);
      setUser(me);
      console.log("[Auth] refreshMe: success");
    } catch (e) {
      console.log("[Auth] refreshMe failed:", e);
    }
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const signIn = async (newToken: string, newUser?: User | null) => {
    console.log("[Auth] signIn: start");
    setTokenState(newToken);

    try {
      await saveToken(newToken);
      console.log("[Auth] signIn: token saved");
    } catch (e) {
      console.log("[Auth] signIn: saveToken failed", e);
    }

    if (newUser) {
      setUser(newUser);
      console.log("[Auth] signIn: user provided");
      return;
    }

    try {
      const me = await apiMe(newToken);
      setUser(me);
      console.log("[Auth] signIn: apiMe success");
    } catch (e) {
      console.log("[Auth] signIn -> apiMe failed:", e);
    }
  };

  const signOut = async () => {
    console.log("[Auth] signOut: start");
    setTokenState(null);
    setUser(null);

    try {
      await clearToken();
      console.log("[Auth] signOut: token cleared");
    } catch (e) {
      console.log("[Auth] signOut: clearToken failed", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, signIn, signOut, refreshMe, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
