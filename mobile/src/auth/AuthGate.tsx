import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import LoadingScreen from "@/src/components/LoadingScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  
  useEffect(() => {
     //only splash when loading, no loading
    if (isLoading) return;

    const first = segments[0]; // "(tabs)", "(auth)", undefined
    const second = segments[1]; // "chatBot", "saved", etc.

    const isAuthGroup = first === "(auth)";
    const isTabsGroup = first === "(tabs)";

    // logged-out allowed:
    const isIntroRoot = !first; // root index screen
    const isGenerate = first === "generate";

    const guestAllowedTabs = new Set(["index", "chatBot", "profile", "saved"]);
    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    if (!token) {
      if (isIntroRoot) return;
      if (isAuthGroup) return;
      if (isGuestAllowedTab) return;
      if (isGenerate) return;

      router.replace("/(tabs)");
      return;
    }

    // logged in: keep out of auth pages
    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, segments, router]);

  if (isLoading) return <LoadingScreen />;

  return <>{children}</>;
}
