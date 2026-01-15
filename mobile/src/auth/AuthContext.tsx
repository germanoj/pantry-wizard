import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getToken, setToken as saveToken, clearToken } from "./tokenStorage";
import { apiMe, User } from "./library";

type AuthContextValue = {
  token: string | null;       // null = logged out OR not loaded yet
  user: User | null;          // null = logged out OR user not fetched yet
  isLoading: boolean;         // true while token is loading from storage
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  //if null token then not logged in
  //if user null then not logged in 


  //this loads the token once
  useEffect(() => {
    const loadToken = async () => {
      try {
        const saved = await getToken();
      // NULL CHECK #1
      // getToken() may return:
      // - string (valid token)
      // - null (no token stored)
      // - undefined (storage error or empty)
        if (saved !== null && saved !== undefined) {
        setTokenState(saved); //user might be logged in
      } else {
        setTokenState(null); //def logged out
      }
      } finally {
        setIsLoading(false); //stop loading screen (if i make it)
      }
    };

    loadToken();
  }, []);

  const refreshMe = useCallback(async () => {
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
  }, [token]);

  // whenever token changes, fetch user (or clear it)
  useEffect(() => {
    //  NULL CHECK #3
    // Token was removed (logout or expired)

  if (!token) {
    setUser(null); // clear stale user data

    return;
  }

  refreshMe(); // token exists → load user
}, [token, refreshMe]);



  const signIn = async (newToken: string, newUser?: User | null) => {
    setTokenState(newToken);
    await saveToken(newToken);

    // NULL CHECK #4
    // Login/register sometimes already returns the user

    // if login/register returned user, set it immediately
    if (newUser) {
      setUser(newUser); //instant ui update
      return;
    }

    // otherwise get it
    try {
      const me = await apiMe(newToken);
      setUser(me);
    } catch (e) {
      console.log("signIn -> apiMe failed:", e);
    }
  };

  const signOut = async () => {
    setTokenState(null); //logged out
    setUser(null);        // clear profile data
    await clearToken(); //remove storage
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
  