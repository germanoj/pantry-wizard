import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";
import { apiMe, User } from "./library";

type AuthContextValue = {
  token: string | null; // null = logged out OR not loaded yet
  user: User | null; // null = logged out OR user not fetched yet
  isLoading: boolean; // true while token is loading from storage
  //token and user are nullable when first starting bc dont know them
  //cleared when logged out

  signIn: (newToken: string, newUser?: User | null) => Promise<void>;
  signOut: () => Promise<void>;
  //this refreshes after udpates
  refreshMe: () => Promise<void>;

  //profile update user after PATCH /users/me
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
//undefined wraps components in authprovider, prevents silent buggies

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
  const [user, setUser] = useState<User | null>(null);
  //if null token then not logged in
  //if user null then not logged in

  //this loads the token once
  useEffect(() => {
    let mounted = true;

    const loadToken = async () => {
      try {
        const saved = await getToken();

        // getToken() may return:
        // - string (valid token)
        // - null (no token stored)
        // - undefined (storage error or empty)
        if (!mounted) return;

        if (saved !== null && saved !== undefined) {
          setTokenState(saved); // user might be logged in
        } else {
          setTokenState(null); // definitely logged out
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

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

  const refreshMe = async () => {
    // NULL CHECK #2
    // No token = no authenticated user

    if (!token) return;
    try {
      const me = await apiMe(token);
      setUser(me);
    } catch (e) {
      console.log("refreshMe failed:", e);
      // optional: if token is invalid, force logout
      // await signOut();
    }
  };

  // whenever token changes, fetch user (or clear it)
  useEffect(() => {
    //  NULL CHECK #3
    // Token was removed (logout or expired)

    if (!token) {
      setUser(null); // clear stale user data

      return;
    }

    refreshMe(); // token exists → load user
  }, [token]);

  const signIn = async (newToken: string, newUser?: User | null) => {
    setTokenState(newToken);
    // Save token (guard against hanging storage)
    try {
      await withTimeout(saveToken(newToken), 1500, "saveToken()");
    } catch (err) {
      console.error("Auth: saveToken failed (or timed out)", err);
    }

    // Login/register sometimes already returns the user.
    // If login/register returned user, set it immediately.
    if (newUser) {
      setUser(newUser); // instant UI update
      return;
    }

    // Otherwise fetch current user.
    try {
      const me = await apiMe(newToken);
      setUser(me);
    } catch (e) {
      console.log("signIn -> apiMe failed:", e);
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
  // NULL CHECK #5
  // Prevents using auth outside provider
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
