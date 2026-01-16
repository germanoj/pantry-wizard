import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
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
    const isIntroRoot = !first; // root index / intro splash
    const isGenerate = first === "generate";

    const guestAllowedTabs = new Set(["index", "chatBot", "profile"]);

    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    if (!token) {
      if (isIntroRoot) return;
      if (isAuthGroup) return;

      if (isGuestAllowedTab) return;
      if (isGenerate) return;

      // Block everything else for logged-out users
      router.replace("/(tabs)");
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
  }, [token, isLoading, splashDone, segments, router]);

  // While auth initializes, let the intro splash render (no loading overlay).
  if (isLoading && !isIntroRoot) return <LoadingScreen />;

  return <>{children}</>;
}
