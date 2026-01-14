// This file decides where users go when auth state changes

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

  useEffect(() => {
    // 🚨 Do NOT redirect while loading — just wait
    if (isLoading) return;

    const first = segments[0]; // "(tabs)", "(auth)", "generate", undefined
    const second = segments[1]; // "chatBot", "saved", etc.

    const isAuthGroup = first === "(auth)";
    const isTabsGroup = first === "(tabs)";
    const isIntroRoot = !first; // app/index.tsx intro splash

    const isGenerate = first === "generate";

    const guestAllowedTabs = new Set(["index", "chatBot", "profile", "saved"]);

    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    // 🚫 LOGGED OUT USERS
    if (!token) {
      if (atRoot) return; //splash allowed
      if (isAuthGroup) return; //login/reg allowed
      if (isGuestAllowedTab) return;
      if (isGenerate) return;

      // Anything else → send to tabs home
      router.replace("/(tabs)");
      return;
    }

    // ✅ LOGGED IN USERS
    // Keep logged-in users out of auth screens
    if (isIntroRoot) {
      if (splashDone) router.replace("/(tabs)");
      return;
    }

    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, splashDone, segments, router]);

  /**
   * 🔑 CRITICAL CHANGE
   *
   * Never block rendering forever.
   * While loading, render children so web can hydrate.
   */
  if (isLoading) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
