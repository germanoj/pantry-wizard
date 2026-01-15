//this file decides where the users go when the state of auth changes

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import { useSplash } from "./SplashContext";
import LoadingScreen from "@/src/components/LoadingScreen";


export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const {splashDone} = useSplash();

  const router = useRouter();
  const segments = useSegments();
  
  const first = segments[0];
  const second = segments[1];
  const isAuthGroup = first === "(auth)";
  const isTabsGroup = first === "(tabs)";
  const atRoot = !first; //this is the app/ index splash screen 

  useEffect(() => {
     //only splash when loading, no loading
    if (isLoading) return;
    //{
  // Let the splash show while auth initializes
    //if (atRoot) return <>{children}</>;
  // Anywhere else, you can show your loading animation
    //return <LoadingScreen />;
  //}

    // routes when logged out:
    // - "/" ( app/index.tsx intro splash)
    // - auth screens
    // - wizard screen inside tabs: /(tabs)/chatBot
    //const isIntroRoot = !first; // root index screen
    //const isWizardGuest = isTabsGroup && second === "chatBot";
    const isGenerate = first === "generate";
    //const isRecipes = first === "recipes";
    //const isRecipes = isTabsGroup && second === "recipes";
    //const isProfileGuest = isTabsGroup && second === "profile";
    const guestAllowedTabs = new Set(["index", "chatBot", "profile", "saved"])
    const isGuestAllowedTab = isTabsGroup && guestAllowedTabs.has(String(second));


    // 🚫 Logged out users:
    if (!token) {
      if (atRoot) return; //splash allowed
      if (isAuthGroup) return; //login/reg allowed
      if (isGuestAllowedTab) return;
      //if (isWizardGuest) return;
      if (isGenerate) return;
      //if (isRecipes) return;
      //if (isProfileGuest) return;

      // Block everything else (currently just saved?)
      router.replace("/"); //sends to splash screen
      return;
    }

    // logged in users:
    // keep them out of auth pages
      if (atRoot) {
        if (splashDone) router.replace("/(tabs)");
      return;
    }

    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  },  [token, isLoading, splashDone, first, second, atRoot, isAuthGroup, isTabsGroup, router]);

   //only splash when loading, no loading
  if (isLoading && !atRoot) {
  // Anywhere else can see loading screen
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
