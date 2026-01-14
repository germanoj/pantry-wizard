import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/src/auth/AuthContext";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

export default function HomeScreen() {
  const theme = useTheme();
  const { token } = useAuth();

  if (!token) {
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
        <WizardTitle>Welcome to Pantry Wizard 🧙‍♂️</WizardTitle>
        <WizardBody><Link href="/(auth)/login" style={[styles.link, { color: theme.accent2 }]}>Login</Link> to see past recipes and ask the wize wizard for more food inspo</WizardBody>
        <WizardBody> <Link href="/(auth)/register" style={[styles.link, { color: theme.accent2 }]}>Register </Link> a new account </WizardBody>
        <WizardBody> Or visit the <Link href="/(tabs)/chatBot" style={[styles.link, { color: theme.accent2 }]}>wizard</Link> as a guest</WizardBody>
      </Card>
    </View>
  );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
        <WizardTitle>Welcome back fellow magician✨</WizardTitle>
        <Link href="/chatBot"><WizardBody>Visit the Wizard for new recipe ideas</WizardBody></Link>
        <Link href="/saved"><WizardBody>Check out your saved recipes</WizardBody></Link>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {}
});
