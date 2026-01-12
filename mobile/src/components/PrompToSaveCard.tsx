import { View, Pressable } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/src/auth/AuthContext";
import { Card } from "@/src/components/Card";
import { WizardBody, WizardTitle } from "@/src/components/WizardText";

export function SavePromptCard() {
  const { token } = useAuth();

  if (token) return null;

  return (
    <Card>
      <WizardTitle>Want to save your favorites?</WizardTitle>
      <WizardBody>
        Log in or create an account to save recipes and build your spellbook.
      </WizardBody>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <Link href="/(auth)/login" asChild>
          <Pressable style={{ padding: 12 }}>
            <WizardBody>Log in</WizardBody>
          </Pressable>
        </Link>

        <Link href="/(modals)/register-modal" asChild>
          <Pressable style={{ padding: 12 }}>
            <WizardBody>Create account</WizardBody>
          </Pressable>
        </Link>
      </View>
    </Card>
  );
}
