import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  signIn: (newToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // If storage hangs, we still proceed after timeout.
        const saved = await withTimeout(getToken(), 1500, "getToken()");
        if (mounted) setTokenState(saved ?? null);
        console.log("Auth: token loaded", !!saved);
      } catch (err) {
        console.error(
          "Auth: token load failed (or timed out). Continuing without token.",
          err
        );
        if (mounted) setTokenState(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (newToken: string) => {
    setTokenState(newToken);
    try {
      await withTimeout(saveToken(newToken), 1500, "saveToken()");
    } catch (err) {
      console.error("Auth: saveToken failed (or timed out)", err);
    }
  };

  const signOut = async () => {
    setTokenState(null);
    try {
      await withTimeout(clearToken(), 1500, "clearToken()");
    } catch (err) {
      console.error("Auth: clearToken failed (or timed out)", err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
