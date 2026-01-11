import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthContext";
import LoadingScreen from "../components/LoadingScreen";


export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const first = segments[0];   // e.g. "(tabs)", "(auth)", "recipe"
    const second = segments[1];  // e.g. "chat", "saved", etc.

    const isAuthGroup = first === "(auth)";

    // ✅ PUBLIC ROUTES (allowed even when logged out)
    const isPublic =
      // allow the generator tab (example: your wizard is in tabs/chat)
      (first === "(tabs)" && (second === "chatBot" || second === "recipes" || second === "index"))
      // allow recipe detail route (optional)
      || first === "recipe";

    // 🚫 Not logged in
    if (!token) {
      // Auth screens are allowed
      if (isAuthGroup) return;

      // Public screens are allowed
      if (isPublic) return;

      // Everything else requires login
      router.replace("/(auth)/login");
      return;
    }

    // ✅ Logged in
    // Keep them out of auth pages
    if (token && isAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
