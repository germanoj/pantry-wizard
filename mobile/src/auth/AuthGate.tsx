//this file decides where the users go when the state of auth changes

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import { useSplash } from "./SplashContext";
import LoadingScreen from "@/src/components/LoadingScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const { splashDone } = useSplash();

  const router = useRouter();
  const segments = useSegments();
  const isIntroRoot = !segments?.[0];
  const first = segments[0];
  const second = segments[1];
  const isAuthGroup = first === "(auth)";
  const isTabsGroup = first === "(tabs)";
  const atRoot = !first; //this is the app/ index splash screen

  useEffect(() => {
    //only splash when loading, no loading
    if (isLoading) return;

    const first = segments[0]; // "(tabs)", "(auth)", undefined
    const second = segments[1]; // "chatBot", "saved", etc.

    const isAuthGroup = first === "(auth)";
    const isTabsGroup = first === "(tabs)";
    const isIntroRoot = !first; // app/index.tsx intro splash

    const isGenerate = first === "generate";
    //const isRecipes = first === "recipes";
    //const isRecipes = isTabsGroup && second === "recipes";
    //const isProfileGuest = isTabsGroup && second === "profile";
    const guestAllowedTabs = new Set(["index", "chatBot", "profile"]);

    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    // 🚫 Logged out users:
    if (!token) {
      if (isIntroRoot) return; // splash allowed
      //splash allowed
      if (isAuthGroup) return; //login/reg allowed
      if (isGuestAllowedTab) return;
      //if (isWizardGuest) return;
      if (isGenerate) return;
      //if (isRecipes) return;
      //if (isProfileGuest) return;

      // Block everything else (currently just saved?)
      router.replace("/(tabs)");
      return;
    }

    // ✅ LOGGED IN USERS
    // Keep logged-in users out of auth screens
    if (isIntroRoot) {
      if (splashDone) router.replace("/(tabs)");
      return;
    }

    // logged in users:
    // keep them out of auth pages

    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, splashDone, segments, router]);

  // While auth initializes, let the intro splash render (no loading overlay).
  if (isLoading && !isIntroRoot) return <LoadingScreen />;

  return <>{children}</>;
}
