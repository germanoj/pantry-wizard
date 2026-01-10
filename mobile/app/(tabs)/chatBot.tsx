import { View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

export default function ChatBot() {
  const theme = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
      <WizardTitle>Time to whip you up a magical recipe!</WizardTitle>
      <WizardBody>Click below to get started</WizardBody>
      <Link href="/generate">
        <Pressable style={styles.button}>
          <WizardBody>Visit the Wizard</WizardBody>{" "}
          {/*change the wording in generate stack*/}
        </Pressable>
      </Link>
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
});
