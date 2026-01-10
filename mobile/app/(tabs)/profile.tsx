import { View, StyleSheet } from "react-native";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';
//import { use } from "react";

export default function ProfilePage() {
  const theme = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
      <WizardTitle>Welcome back, user!</WizardTitle>
      <WizardBody>Here are the recipes you&apos;ve tried in the past:</WizardBody>
      <WizardBody>
        Ready to try a new recipe? Visit the wizard & let&apos;s get
        cookin&apos;!
      </WizardBody>
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
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});
