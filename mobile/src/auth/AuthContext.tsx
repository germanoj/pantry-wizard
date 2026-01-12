import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const saved = await getToken();
        if (saved) setTokenState(saved);
        else setTokenState(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (newToken) => {
    setTokenState(newToken);
    await saveToken(newToken);
  };

  const signOut = async () => {
    setTokenState(null);
    await clearToken();
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
