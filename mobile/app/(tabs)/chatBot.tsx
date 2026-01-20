import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/src/theme/usetheme";
import { WizardBody, WizardTitle, WizardButton } from "@/src/components/WizardText";
import { Card } from "@/src/components/Card";

export default function ChatBot() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <WizardTitle style={{ textAlign: "center", alignSelf: "center" }}>
          Time to whip you up a magical recipe!
        </WizardTitle>
        <WizardBody style={{ marginTop: 8, textAlign: "center" }}>Click below to get started</WizardBody>
          <WizardButton style={{ marginTop: 16 }}
            onPress={() => router.push("/generate")} variant="surface">
            <WizardBody style={{ color: theme.textOnSurface, textAlign: "center", width: "100%" }}>Visit the Wizard</WizardBody>
          </WizardButton>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
