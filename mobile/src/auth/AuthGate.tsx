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
  const atRoot = !first;


  useEffect(() => {
    if (isLoading) return;

    //const first = segments[0]; // "(tabs)", "(auth)", undefined
    //const second = segments[1]; // "chatBot", "saved", etc.

    //const isAuthGroup = first === "(auth)";
    //const isTabsGroup = first === "(tabs)";
    //const atRoot = !first; //this is the app/ index splash screen 

    // logged-out allowed:
    //const isIntroRoot = !first; // root index screen
    const isGenerate = first === "generate";

    const guestAllowedTabs = new Set(["index", "chatBot", "profile", "saved"]);
    const isGuestAllowedTab =
      isTabsGroup && guestAllowedTabs.has(String(second));

    if (!token) {
      //if (isIntroRoot) return;
      //if (isAuthGroup) return;
      if (atRoot) return; //splash allowed
      if (isAuthGroup) return; //login/reg allowed
      if (isGuestAllowedTab) return;
      if (isGenerate) return;

      router.replace("/"); //sends to splash screen
      return;
    }

    // logged in: keep out of auth pages
    if (atRoot) {
      if (splashDone) router.replace("/(tabs)");
      return;
    }

    if (isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, splashDone, first, second, atRoot, isAuthGroup, isTabsGroup, router]);

  if (isLoading && !atRoot) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
