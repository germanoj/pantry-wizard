import { 
  Modal, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { useEffect, useState } from "react";

import { apiUpdateUsername, apiDeactivateAccount } from "@/src/auth/library";

import { useAuth } from "@/src/auth/AuthContext";
import { useTheme } from '@/src/theme/usetheme';
import { useThemePreference } from "@/src/theme/ThemePreferenceProvider";
import { WizardBody, WizardTitle, WizardInput } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';
//import { use } from "react";

export default function ProfilePage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {preference, setPreference, isHydrated} = useThemePreference();
  const { token, user, signOut, setUser } = useAuth();

  const [showLogout, setShowLogout] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [showDeactivate, setShowDeactivate] = useState(false);


  useEffect(() => {
    if (user && user.username) {
      setNameDraft(user.username);
    } else {
      setNameDraft("");
    }
  }, [user]);

  const saveUsername = async () => {
    if (!token) {
      Alert.alert("Not logged in", "Please log in again.");
      return;
    }

    const cleaned = nameDraft.trim();

    if (!cleaned) {
      Alert.alert("Missing name", "Please enter a username.");
      return;
    }

    try {
      const updated = await apiUpdateUsername(token, cleaned);
      setUser(updated);            // updates AuthContext immediately
      setShowEditName(false);
      Alert.alert("Saved!", "Your username has been updated.");
    } catch (e: any) {
      Alert.alert("Error", e && e.message ? e.message : String(e));
    }
  };

  if(!isHydrated) return null; //prevents that weird flash when loading
  //const isDark = theme.mode === "dark";
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

    const confirmDeactivate = async () => {
    try {
      if (!token) {
      
        Alert.alert("Not logged in", "Please log in again.");
        return;
      } 

      await apiDeactivateAccount(token);  // calls POST /users/me/deactivate
      await signOut();                    // clears token locally
      setShowDeactivate(false);
      router.replace("/(tabs)");          // or "/" depending on your flow
    } catch (e: any) {
      console.log("Deactivate failed:", e);
      Alert.alert("Couldn’t deactivate", e?.message ?? String(e));
      setShowDeactivate(false);
    }
  };

  if (!token) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
                contentContainerStyle={[
                  styles.content,
                  { paddingTop: insets.top + 16 },
                  { flexGrow: 1, width: "100%"},
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                showsVerticalScrollIndicator={false}
            >
      
          <Card>
            <WizardTitle style={{ textAlign: "center", alignSelf: "center" }}>Hey there stranger!👋</WizardTitle> 
            <WizardBody>Make an 
              <Link href="/(auth)/register" style={[ { color: theme.accent2 }]} > account </Link> 
              and start saving your recipes✨
            </WizardBody>
          </Card>
        </ScrollView>
      </View>

    );
  }
  return (
  <View style={[styles.container, { backgroundColor: theme.background }]}>
    <ScrollView
                contentContainerStyle={[
                  styles.content,
                  { paddingTop: insets.top + 16 },
                  { flexGrow: 1, width: "100%"},

                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                showsVerticalScrollIndicator={false}
            >
      
    <Card>
      <WizardTitle style={{ textAlign: "center", alignSelf: "center" }}>
        Welcome back, {user && user.username ? user.username : "wizard"}!
      </WizardTitle>

      <WizardBody>
        Here you can find all the settings to personalize your wizarding
        experience✨
      </WizardBody>

      {/* THEME SETTING */}
      <View
        style={[
          styles.settingCard,
          { borderColor: theme.border, backgroundColor: theme.surface2 },
        ]}
      >
        <WizardBody style={{ color: theme.textMuted, marginBottom: 10 }}>
          Theme:
        </WizardBody>

        <View
          style={[
            styles.segmentWrap,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
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
      </View>

      {/* USERNAME SETTING */}
      <View
        style={[
          styles.settingCard,
          { borderColor: theme.border, backgroundColor: theme.surface2 },
        ]}
      >
        <View style={styles.row}>
          <WizardBody style={{ color: theme.textMuted }}>Username</WizardBody>
          <WizardBody style={{ color: theme.textOnSurface }}>
            {user && user.username ? user.username : "-"}
          </WizardBody>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.smallBtn,
            { borderColor: theme.border, backgroundColor: theme.surface },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => setShowEditName(true)}
        >
          <WizardBody style={{ color: theme.textOnSurface }}>
            Change username
          </WizardBody>
        </Pressable>
      </View>

      {/* LOGOUT BUTTON */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { borderColor: theme.border, backgroundColor: theme.surface2 },
          pressed && { opacity: 0.75 },
        ]}
        onPress={() => setShowLogout(true)}
      >
        <WizardBody style={[styles.logoutText, { color: theme.textOnSurface }]}>
          Log out
        </WizardBody>
      </Pressable>

      {/* DEACTIVATE BUTTON */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { borderColor: theme.danger, backgroundColor: theme.surface2 },
          pressed && { opacity: 0.75 },
        ]}
        onPress={() => setShowDeactivate(true)}
      >
        <WizardBody style={[styles.logoutText, { color: theme.danger }]}>
          Deactivate account
        </WizardBody>
      </Pressable>

    </Card>

    {/* ========================= */}
    {/* EDIT USERNAME MODAL (1)   */}
    {/* ========================= */}
    <Modal
      visible={showEditName}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEditName(false)}
    >
      {/* Backdrop */}
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
        onPress={() => setShowEditName(false)}
      >
        {/* Inner card (stop backdrop closing) */}
        <Pressable
          onPress={() => {}}
          style={[
            styles.modalCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <WizardTitle>Change username</WizardTitle>

          <WizardInput
            value={nameDraft}
            onChangeText={setNameDraft}
            placeholder="new username"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surface2,
              },
            ]}
          />

          <View style={styles.modalButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                { borderColor: theme.border, backgroundColor: theme.surface2 },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => setShowEditName(false)}
            >
              <WizardBody style={{ color: theme.textOnSurface }}>Cancel</WizardBody>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                { borderColor: theme.primary, backgroundColor: theme.primary },
                pressed && { opacity: 0.75 },
              ]}
              onPress={saveUsername}
            >
              <WizardBody style={{ color: theme.primaryText }}>Save</WizardBody>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>

    {/* ========================= */}
    {/* LOGOUT MODAL (2)          */}
    {/* ========================= */}
    <Modal
      visible={showLogout}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLogout(false)}
    >
      {/* Backdrop */}
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
        onPress={() => setShowLogout(false)}
      >
        {/* Inner card (stop backdrop closing) */}
        <Pressable
          onPress={() => {}}
          style={[
            styles.modalCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
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
                { borderColor: theme.border, backgroundColor: theme.surface2 },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => setShowLogout(false)}
            >
              <WizardBody style={{ color: theme.textOnSurface }}>Cancel</WizardBody>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                { borderColor: theme.danger, backgroundColor: theme.surface2 },
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

    {/* ========================= */}
    {/* DEACTIVATE MODAL (3)      */}
    {/* ========================= */}
    <Modal
      visible={showDeactivate}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDeactivate(false)}
    >
      {/* Backdrop */}
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
        onPress={() => setShowDeactivate(false)}
      >
        {/* Inner card (stop backdrop closing) */}
        <Pressable
          onPress={() => {}}
          style={[
            styles.modalCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <WizardTitle>Deactivate account?</WizardTitle>

          <WizardBody style={{ marginTop: 8, color: theme.textMuted }}>
            If you&apos;d like to exit through the wardrobe this will 
            delete your login info until you reactivate your account and return to the magic.
          </WizardBody>

          <View style={styles.modalButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                { borderColor: theme.border, backgroundColor: theme.surface2 },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => setShowDeactivate(false)}
            >
              <WizardBody style={{ color: theme.textOnSurface }}>Cancel</WizardBody>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                { borderColor: theme.danger, backgroundColor: theme.surface2 },
                pressed && { opacity: 0.75 },
              ]}
              onPress={confirmDeactivate}
            >
              <WizardBody style={{ color: theme.danger }}>Deactivate</WizardBody>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
              </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
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
row: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

smallBtn: {
  width: "100%",
  paddingVertical: 12,
  borderRadius: 16,
  alignItems: "center",
  borderWidth: 1,
},

input: {
  marginTop: 12,
  borderWidth: 1,
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 14,
  fontSize: 16,
},

});