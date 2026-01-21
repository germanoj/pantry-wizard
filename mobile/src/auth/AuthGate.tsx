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

  const first = segments?.[0];
  const second = segments?.[1];

  const isIntroRoot = !first; // app/ index splash screen
  const isAuthGroup = first === "(auth)";
  const isTabsGroup = first === "(tabs)";
  const isGenerate = first === "generate";
  const isRecipe = first === "recipe";

  useEffect(() => {
    // don't run any redirects until auth loads
    if (isLoading) return;
    if (!token) {
      console.log("GUEST SEGMENTS:", segments);
    }
    // logged-out allowed tabs (keep aligned with Tabs layout rules)
    const guestAllowedTabs = new Set(["index", "chatBot", "profile"]);
    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));
    const isRecipeDetail = first === "recipe" && second === "[id]";

    if (!token) {
      if (isIntroRoot) return; // splash allowed
      if (isAuthGroup) return; // login/reg allowed
      if (isGuestAllowedTab) return;
      if (isGenerate) return;
      if (isRecipe) return; // ✅ allow recipe details

      router.replace("/");
      return;
    }

    // ✅ LOGGED IN USERS
    // If we're on the intro root, wait for splash to finish before routing to tabs
    if (isIntroRoot) {
      if (splashDone) router.replace("/(tabs)");
      return;
    }

    // Keep logged-in users out of auth pages
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
