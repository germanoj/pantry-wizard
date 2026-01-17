import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle, WizardInput, WizardButton } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

import { useAuth } from "@/src/auth/AuthContext";
import { apiLogin, apiReactivate } from "@/src/auth/library";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {signIn} = useAuth();

  const [canReactivate, setCanReactivate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      setCanReactivate(false);
      setErrorMsg(null);
      
      const data = await apiLogin(email, password);
      // EXPLICIT NULL CHECK
      // data.user may be undefined if backend changes or fails
            // this updates auth state
    if (data.user !== null && data.user !== undefined) {
      await signIn(data.token, data.user);
    } else {
      await signIn(data.token, null);
    }

      Alert.alert("Welcome back!", "You're logged in. Let's get cookin'!");
      router.replace("/(tabs)/chatBot");
    } catch (err: any) {
      const msg =
        err?.message || "Hmm the magic isn't magic-ing... login failed. Try again?";
      
      setErrorMsg(msg);

      if (err?.code === "ACCOUNT_DEACTIVATED") {
            setCanReactivate(true);
            // optional: you can show a nicer alert here
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
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Card>
      <WizardTitle>Log in</WizardTitle>

      <WizardInput
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <WizardInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={styles.input}
      />

      <WizardButton style={styles.button} onPress={onLogin} disabled={loading}>
        <WizardBody style={[styles.buttonText, { color: theme.primaryText }]}>
            {loading ? "Casting spell..." : "Accio"}</WizardBody>
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
              Alert.alert("Reactivation failed", err?.message ?? "Try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <WizardBody style={{ color: theme.danger }}>Reactivate account</WizardBody>
        </WizardButton>
      )}

      <WizardBody style={styles.linkRow}>
       First time visiting the wizard? <Link href="/register" style={[styles.link, { color: theme.accent2 }]}>Create an account</Link>
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
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 10,
    fontFamily: "YuseiMagic",
},
  input: { width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16, marginTop: 10 },
  button: { width: "100%" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  linkRow: { marginTop: 12, fontSize: 14 },
  link: {

  },
});
