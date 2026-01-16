import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";
import { apiMe, User } from "./library";

async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });

  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (t) clearTimeout(t);
  }
}

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
      try {
        const timeout = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 4000)
        );

        const saved = await Promise.race([
          getToken() as Promise<string | null | undefined>,
          timeout,
        ]);

        if (!mounted) return;
        setTokenState(saved ?? null);
      } catch {
        if (!mounted) return;
        setTokenState(null);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadToken();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;

    try {
      const me = await apiMe(token);
      setUser(me);
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshMe();
  }, [token, refreshMe]);

  const signIn = async (newToken: string, newUser?: User | null) => {
    setTokenState(newToken);

    try {
      await withTimeout(saveToken(newToken), 1500, "saveToken()");
    } catch (err) {
      console.error("Auth: saveToken failed (or timed out)", err);
    }

    if (newUser) {
      setUser(newUser);
      return;
    }

    try {
      const me = await apiMe(newToken);
      setUser(me);
    } catch {
      // ignore
    }
  };

  const signOut = async () => {
    setTokenState(null);
    setUser(null);

    try {
      await withTimeout(clearToken(), 1500, "clearToken()");
    } catch (err) {
      console.error("Auth: clearToken failed (or timed out)", err);
    }
  };

  // ✅ IMPORTANT: return is INSIDE AuthProvider
  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, signIn, signOut, refreshMe, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ IMPORTANT: useAuth is OUTSIDE AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
