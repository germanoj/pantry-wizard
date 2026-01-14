//this file decides where the users go when the state of auth changes

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import LoadingScreen from "@/src/components/LoadingScreen";


export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const first = segments[0];  // "(tabs)", "(auth)", undefined
    const second = segments[1]; // "chatBot", "saved", etc.

    const isAuthGroup = first === "(auth)";
    const isTabsGroup = first === "(tabs)";

    // routes when logged out:
    // - "/" ( app/index.tsx intro splash)
    // - auth screens
    // - wizard screen inside tabs: /(tabs)/chatBot
    const isIntroRoot = !first; // root index screen
    //const isWizardGuest = isTabsGroup && second === "chatBot";
    //const isGenerate = first === "generate";
    //const isRecipes = first === "recipes";
    //const isRecipes = isTabsGroup && second === "recipes";
    //const isProfileGuest = isTabsGroup && second === "profile";
    const guestAllowedTabs = new Set(["index", "chatBot", "profile", "saved"])
    const isGuestAllowedTab = isTabsGroup && guestAllowedTabs.has(String(second));


    // 🚫 Logged out users:
    if (!token) {
      if (isIntroRoot) return;
      if (isAuthGroup) return;
      if (isGuestAllowedTab) return;
      //if (isWizardGuest) return;
      //if (isGenerate) return;
      //if (isRecipes) return;
      //if (isProfileGuest) return;

      // Block everything else (currently just saved?)
      router.replace("/(tabs)");
      return;
    }

    // logged in users:
    // keep them out of auth pages
    if (token && isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, segments, router]);

if (isLoading) return <LoadingScreen />;

  return <>{children}</>;
}
