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
  let t: any;
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t);
  }
}

type AuthContextValue = {
  token: string | null; // null = logged out OR not loaded yet
  user: User | null; // null = logged out OR user not fetched yet
  isLoading: boolean; // true while token is loading from storage
  //token and user are nullable when first starting bc dont know them
  //cleared when logged out

  signIn: (newToken: string, newUser?: User | null) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
//undefined wraps components in authprovider, prevents silent buggies

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  //if null token then not logged in
  //if user null then not logged in
  //this loads the token once

  useEffect(() => {
    let mounted = true;

    const loadToken = async () => {
      try {
        // ✅ Failsafe: if secure storage hangs, unblock UI anyway
        const timeout = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 4000)
        );

        const saved = await Promise.race([
          getToken() as Promise<string | null | undefined>,
          timeout,
        ]);

        // getToken() may return:
        // - string (valid token)
        // - null (no token stored)
        // - undefined (storage error or empty)
        if (!mounted) return;

        setTokenState(saved ?? null);
      } catch (e) {
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
    // NULL CHECK #2
    // No token = no authenticated user
    if (!token) return;

    try {
      const me = await apiMe(token);
      setUser(me);
    } catch (e) {
      // if apiMe fails, don't crash; leave user as-is or null
    }
  }, [token]);

  useEffect(() => {
    // Token was removed (logout or expired)
    if (!token) {
      setUser(null); // clear stale user data
      return;
    }

    refreshMe(); // token exists → load user
  }, [token, refreshMe]);

  const signIn = async (newToken: string, newUser?: User | null) => {
    setTokenState(newToken);

    // Save token (guard against hanging storage)
    try {
      await withTimeout(saveToken(newToken), 1500, "saveToken()");
    } catch (err) {
      console.error("Auth: saveToken failed (or timed out)", err);
    }

    // Login/register sometimes already returns the user.
    if (newUser) {
      setUser(newUser);
      return;
    }

    // Otherwise fetch current user.
    try {
      const me = await apiMe(newToken);
      setUser(me);
    } catch (e) {
      // ignore; user stays null until refresh succeeds
    }
  };

  const signOut = async () => {
    setTokenState(null); // logged out
    setUser(null); // clear profile data

    try {
      await withTimeout(clearToken(), 1500, "clearToken()");
    } catch (err) {
      console.error("Auth: clearToken failed (or timed out)", err);
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
