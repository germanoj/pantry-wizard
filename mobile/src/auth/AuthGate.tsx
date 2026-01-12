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

    // ✅ Public routes when logged out:
    // - "/" (your app/index.tsx intro splash)
    // - auth screens
    // - wizard screen inside tabs: /(tabs)/chatBot
    const isIntroRoot = !first; // root index screen
    const isWizardGuest = isTabsGroup && second === "chatBot";
    const isGenerate = first === "generate";
    const isRecipes = first === "recipes";


    // 🚫 Logged out users:
    if (!token) {
      if (isIntroRoot) return;
      if (isAuthGroup) return;
      if (isWizardGuest) return;
      if (isGenerate) return;
      if (isRecipes) return;

      // Block everything else (like saved/profile)
      router.replace("/");
      return;
    }

    // ✅ Logged in users:
    // keep them out of auth pages
    if (token && isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, segments]);

if (isLoading) return <LoadingScreen />;

  return <>{children}</>;
}
