import { Modal, Pressable, StyleSheet, View, Text } from "react-native";

import { router, Link } from "expo-router";
import { useState } from "react";

import { useAuth } from "@/src/auth/AuthContext";
import { useTheme } from '@/src/theme/usetheme';
import { useThemePreference } from "@/src/theme/ThemePreferenceProvider";
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';
//import { use } from "react";

export default function ProfilePage() {
  const theme = useTheme();
  const {preference, setPreference, toggleDarkMode, isHydrated} = useThemePreference();
  const {token} = useAuth();
  const { signOut } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  if(!isHydrated) return null; //prevents that weird flash when loading
  const isDark = theme.mode === "dark";
  //changed to a modal set up instead so works on both web and mobile
   const confirmLogout = async () => {
    try {
      await signOut();
      setShowLogout(false);
      router.replace("/(tabs)"); // sends to tab index (HomeScreen)
    } catch (e) {
      console.log("Logout failed:", e);
      setShowLogout(false);
    }
  };


/*  const onLogout = () => {
        Alert.alert("Log out?", "You’ll be returned to the home screen.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await signOut();
           },
          },
        ]);
      };*/
  if (!token) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Card>
          <WizardTitle>Hey there stranger!👋</WizardTitle> 
          <WizardBody>Make an 
            <Link href="/(auth)/register" style={[ { color: theme.accent2 }]} > account </Link> 
            and start saving your recipes✨
          </WizardBody>
        </Card>
      </View>

    );
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
      
        <WizardTitle>Welcome back, user!</WizardTitle> 
        <WizardBody>Here you can find all the settings to personalize your wizarding experience✨</WizardBody>
        {/*<WizardBody>Here are the recipes you&apos;ve tried in the past:</WizardBody> */}
        {/* keep this on profile page? only do settings etc? */}
        <View style={[styles.settingCard, { borderColor: theme.border, backgroundColor: theme.surface2 }]}>
          <WizardBody style={{ color: theme.textMuted, marginBottom: 10 }}>
            Theme:          
          </WizardBody>

          <View style={[styles.segmentWrap, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            {(["system", "light", "dark"] as const).map((opt) => {
              const selected = preference === opt;

              return (
                <Pressable
                  key={opt}
                  onPress={() => setPreference(opt)}
                  style={({ pressed }) => [
                    styles.segmentBtn,
                    selected && { backgroundColor: theme.primary },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: selected ? theme.primaryText : theme.textOnSurface },
                    ]}
                  >
                    {opt === "system" ? "System" : opt === "light" ? "Light" : "Dark"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/*<WizardBody style={{ marginTop: 10, color: theme.textMuted }}>
            Current: {preference === "system" ? `System (${theme.mode})` : preference}
          </WizardBody>*/}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            {
              borderColor: theme.border,
              backgroundColor: theme.surface2,
            },
            pressed && { opacity: 0.75 },
          ]}
          onPress={() => setShowLogout(true)}
        >
          <WizardBody style={[styles.logoutText, { color: theme.textOnSurface }]}>
            Log out
          </WizardBody>
        </Pressable>
      </Card>

      {/*  permanent modal for both ios and web (no alerts) */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        {/* Backdrop: tap outside to close */}
        <Pressable
          style={[styles.backdrop, { backgroundColor: theme.overlay }]}
          onPress={() => setShowLogout(false)}
        >
          {/* Inner card: prevent backdrop close */}
          <Pressable
            onPress={() => {}}
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <WizardTitle>Log out?</WizardTitle>
            <WizardBody style={{ marginTop: 8, color: theme.textMuted }}>
              You’ll be returned to the muggle world.
            </WizardBody>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalBtn,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface2,
                  },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => setShowLogout(false)}
              >
                <WizardBody style={{ color: theme.textOnSurface }}>
                  Cancel
                </WizardBody>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalBtn,
                  {
                    borderColor: theme.danger,
                    backgroundColor: theme.surface2,
                  },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={confirmLogout}
              >
                <WizardBody style={{ color: theme.danger }}>Log out</WizardBody>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },

  logoutButton: {
    marginTop: 16,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  logoutText: { fontSize: 16 },

  backdrop: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  modalCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },
  modalButtons: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  settingCard: {
  width: "100%",
  marginTop: 12,
  padding: 14,
  borderRadius: 16,
  borderWidth: 1,
},

segmentWrap: {
  width: "100%",
  flexDirection: "row",
  borderRadius: 999,
  borderWidth: 1,
  padding: 4,
  gap: 6,
},

segmentBtn: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
},

segmentText: {
  fontSize: 14,
  fontWeight: "600",
},

});