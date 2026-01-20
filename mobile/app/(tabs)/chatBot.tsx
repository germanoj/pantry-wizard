import { View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/src/theme/usetheme";
import { WizardBody, WizardTitle } from "@/src/components/WizardText";
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
          <Pressable
            onPress={() => router.push("/generate")}
            style={({ pressed }) => [
              styles.primaryButton,
              { borderColor: theme.border, backgroundColor: theme.surface2 },
              pressed && { opacity: 0.75, transform: [{ scale: 0.99}] },
            ]}>
            <WizardBody style={{ color: theme.textOnSurface, textAlign: "center", width: "100%" }}>Visit the Wizard</WizardBody>
          </Pressable>
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
  primaryButton: {
    marginTop: 16,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
});
