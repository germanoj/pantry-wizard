import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import { useSplash } from "./SplashContext";
import LoadingScreen from "@/src/components/LoadingScreen";

export function AuthGate({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();
  const { splashDone } = useSplash();

  const router = useRouter();
  const segments = useSegments();

  const first = segments?.[0];
  const second = segments?.[1];

  const isIntroRoot = !first; // app/ index splash screen
  const isAuthGroup = first === "(auth)";
  const isTabsGroup = first === "(tabs)";
  const isGenerate = first === "generate";

  useEffect(() => {
    if (isLoading) return;

    const guestAllowedTabs = new Set(["index", "chatBot", "profile"]);
    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    // ✅ LOGGED OUT USERS
    if (!token) {
      if (isIntroRoot) return; // splash allowed
      if (isAuthGroup) return; // login/reg allowed
      if (isGuestAllowedTab) return;
      if (isGenerate) return;

      // Block everything else for logged-out users: send to splash
      router.replace("/");
      return;
    }

    // ✅ LOGGED IN USERS
    // If we're on the intro root, wait for splash to finish before routing to tabs
    if (isIntroRoot) {
      if (splashDone) router.replace("/(tabs)");
      return;
    }

    // logged in: keep out of auth pages
    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [
    token,
    isLoading,
    splashDone,
    router,
    isIntroRoot,
    isAuthGroup,
    isTabsGroup,
    isGenerate,
    second,
  ]);

  // While auth initializes, let the intro splash render (no loading overlay).
  if (isLoading && !isIntroRoot) return <LoadingScreen />;

  return <>{children}</>;
}
