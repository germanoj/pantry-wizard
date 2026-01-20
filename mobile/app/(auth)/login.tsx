import { useState, useRef, useCallback } from "react";
import { 
  StyleSheet,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,  
} from "react-native";
import { Link, router } from "expo-router";

import { useTheme } from "@/src/theme/usetheme";
import {
  WizardBody,
  WizardTitle,
  WizardInput,
  WizardButton,
} from "@/src/components/WizardText";
import { Card } from "@/src/components/Card";
import WizardToast from "@/src/components/WizardToast";

import { useAuth } from "@/src/auth/AuthContext";
import { apiLogin, apiReactivate } from "@/src/auth/library";

export default function LoginPage() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const isLocked = loading || toastVisible;


  const passwordRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const [canReactivate, setCanReactivate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const pendingAuthRef = useRef<{ token: string; user: any | null } | null>(
    null
  );

    const handleToastHidden = useCallback(async () => {
  setToastVisible(false);

  const pending = pendingAuthRef.current;
  pendingAuthRef.current = null;

  if (!pending) return;

  await signIn(pending.token, pending.user);
  router.replace("/(tabs)/chatBot");
}, [signIn, router]);


  const onLogin = async () => {
    if (loading) return;
    Keyboard.dismiss();

    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setCanReactivate(false);
      setErrorMsg(null);

      const data = await apiLogin(email, password);

      pendingAuthRef.current = { token: data.token, user: data.user || null };
      setToastMsg("Welcome back ✨");
      setToastVisible(true);
    } catch (err: any) {
      const msg =
        err?.message ||
        "Hmm the magic isn't magic-ing... login failed :(";

      setErrorMsg(msg);

      if (err?.code === "ACCOUNT_DEACTIVATED") {
        setCanReactivate(true);
        Alert.alert("Account deactivated", msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={[styles.container, { backgroundColor: theme.background }]}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <WizardToast
              visible={toastVisible}
              message={toastMsg}
              durationMs={1400}
              placement="top"
              onHidden={handleToastHidden}
            />
      <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              showsVerticalScrollIndicator={false}
            >
    <Card>
        <WizardTitle>Log in</WizardTitle>

        <WizardInput
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          style={styles.input}
        />

        <WizardInput
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={onLogin}
          style={styles.input}
        />

        <WizardButton
          style={styles.button}
          onPress={onLogin}
          loading={isLocked}
          disabled={isLocked}
        >
          <WizardBody style={[styles.buttonText, { color: theme.textOnSurface }]}>
            {loading 
            ? "Accio!" 
            : toastVisible 
            ? "✨ Welcome ✨"
            : "Revelio"}
          </WizardBody> 
        </WizardButton>

        {errorMsg && (
          <WizardBody style={{ marginTop: 10, color: theme.danger }}>
            {errorMsg}
          </WizardBody>
        )}

        {canReactivate && (
          <WizardButton
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
              { marginTop: 12, borderColor: theme.danger },
            ]}
            onPress={async () => {
              try {
                setLoading(true);
                const data = await apiReactivate(email, password);

                if (data.user !== null && data.user !== undefined) {
                  await signIn(data.token, data.user);
                } else {
                  await signIn(data.token, null);
                }

                router.replace("/(tabs)/profile");
              } catch (err: any) {
                Alert.alert(
                  "Reactivation failed",
                  err?.message ?? "Try again."
                );
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <WizardBody style={{ color: theme.danger }}>
              Reactivate account
            </WizardBody>
          </WizardButton>
        )}

        <WizardBody style={styles.linkRow}>
          First time visiting the wizard?{" "}
          <Link
            href="/register"
            style={[styles.link, { color: theme.accent2 }]}
          >
            Create an account
          </Link>
        </WizardBody>
      </Card>
    </ScrollView>
  </KeyboardAvoidingView>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    content: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginTop: 10,
  },
  button: { width: "100%", marginTop: 12 },
  buttonText: { fontSize: 16, fontWeight: "600", marginTop: 0 },
  linkRow: { marginTop: 8, fontSize: 14 },
  link: {},
});
