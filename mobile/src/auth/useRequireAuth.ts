import { Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "./AuthContext";

export function useRequireAuth() {
  const { token } = useAuth();

  return function requireAuth(action: () => void) {
    if (token) {
      action();
      return;
    }

    Alert.alert(
      "Would you like to save this recipe?",
      "Log in or create an account to save recipes and build your spellbook!",
      [
        { text: "I don't need any magic in my life, thx", style: "cancel" },
        { text: "Log in", onPress: () => router.push("/(auth)/login") },
        {
          text: "Create account",
          onPress: () => router.push("/(modals)/register-modal"),
        },
      ]
    );
  };
}
