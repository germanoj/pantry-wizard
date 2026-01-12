import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/auth/AuthContext";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';
//import { use } from "react";

export default function ProfilePage() {
  const theme = useTheme();
  const { signOut } = useAuth();

  const onLogout = () => {
        Alert.alert("Log out?", "You’ll be returned to the login screen.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login"); //this prevents going back to the logged in page
           },
          },
        ]);
      };
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
      <WizardTitle>Welcome back, user!</WizardTitle>
      <WizardBody>Here are the recipes you&apos;ve tried in the past:</WizardBody>
      <WizardBody>
        Ready to try a new recipe? Visit the wizard & let&apos;s get
        cookin&apos;!
      </WizardBody>
      <Pressable style={styles.logoutButton} onPress={onLogout}>
          <WizardBody style={styles.logoutText}>Log out</WizardBody>
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
    backgroundColor: "#fff",
    padding: 24,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
    logoutButton: {
    marginTop: 16,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logoutText: {
    fontSize: 16,
  },
  });
