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

  //@jerrad I commented this out bc i dont understand why you changed 
  {/*}
  useEffect(() => {
    let mounted = true;

    const loadToken = async () => {
      //console.log("[Auth] loadToken: start");
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
*/}
  const refreshMe = useCallback(async () => {
    // NULL CHECK #2
    // No token = no authenticated user

    if (!token) return;

    try {
      //console.log("[Auth] refreshMe: start");
      const me = await apiMe(token);
      setUser(me);
      //console.log("[Auth] refreshMe: success");
    } catch (e) {
      console.log("[Auth] refreshMe failed:", e);
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
    //console.log("[Auth] signIn: start");
    setTokenState(newToken);
    await saveToken(newToken);

    {/*}
    try { //jerrad why did you put this in a try catch? I dont think we need so many?
      await saveToken(newToken);
      console.log("[Auth] signIn: token saved");
    } catch (e) {
      console.log("[Auth] signIn: saveToken failed", e);
    }
    */}

    // NULL CHECK #4
    // Login/register sometimes already returns the user

    // if login/register returned user, set it immediately
    if (newUser) {
      setUser(newUser); //instant ui update
      //console.log("[Auth] signIn: user provided");
      return;
    }

    // otherwise get it
    try {
      const me = await apiMe(newToken);
      setUser(me);
      //console.log("[Auth] signIn: apiMe success");
    } catch (e) {
      console.log("[Auth] signIn -> apiMe failed:", e);
    }
  };

  {/* const signIn = async (newToken: string, newUser?: User | null) => {
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
  };*/}

  const signOut = async () => {
    //console.log("[Auth] signOut: start");
    setTokenState(null); //logged out
    setUser(null); //clear profile data
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
