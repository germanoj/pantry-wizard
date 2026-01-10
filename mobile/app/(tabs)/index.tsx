import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
        <WizardTitle>Welcome to Pantry Wizard 🧙‍♂️</WizardTitle>
        <WizardBody><Link style={styles.link} href="/(auth)/login">Login</Link> to see past recipes and ask the wize wizard for more food inspo</WizardBody>
        <WizardBody><Link style={styles.link} href="/(auth)/register">Register</Link> a new account</WizardBody>
        <WizardBody> Or visit the <Link style={styles.link} href="/(tabs)/chatBot">wizard</Link> as a guest</WizardBody>
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
    link: {color: "blue"}
});
