import { useState, useRef } from "react";
import { View, StyleSheet, Alert,TextInput, Keyboard } from "react-native";
import { Link, router } from "expo-router";

import { useTheme } from "@/src/theme/usetheme";
import {
  WizardBody,
  WizardTitle,
  WizardInput,
  WizardButton,
} from "@/src/components/WizardText";
import { Card } from "@/src/components/Card";

import { useAuth } from "@/src/auth/AuthContext";
import { apiLogin, apiReactivate } from "@/src/auth/library";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const [canReactivate, setCanReactivate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

      // data.user may be undefined if backend changes or fails
      if (data.user !== null && data.user !== undefined) {
        await signIn(data.token, data.user);
      } else {
        await signIn(data.token, null);
      }

      Alert.alert("Welcome back!", "You're logged in. Let's get cookin'!");
      router.replace("/(tabs)/chatBot");
    } catch (err: any) {
      const msg =
        err?.message ||
        "Hmm the magic isn't magic-ing... login failed. Try again?";

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

  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          disabled={loading}
        >
          <WizardBody style={[styles.buttonText, { color: theme.primaryText }]}>
            {loading ? "Casting spell..." : "Accio"}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    width: "100%",
    marginTop: 10,
  },
  button: { width: "100%" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  linkRow: { marginTop: 12, fontSize: 14 },
  link: {},
});
