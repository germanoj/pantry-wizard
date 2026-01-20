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
import { WizardBody, WizardTitle, WizardInput, WizardButton } from "@/src/components/WizardText";
import { Card } from "@/src/components/Card";
import WizardToast from "@/src/components/WizardToast";

import { apiRegister } from "@/src/auth/library";
import { useAuth } from "@/src/auth/AuthContext";

export default function RegisterPage() {
  const theme = useTheme();
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const pendingAuthRef = useRef<{ token: string; user: any | null } | null>(
    null
  );

    const handleToastHidden = useCallback(async () => {
      setToastVisible(false);

      const pending = pendingAuthRef.current;
      pendingAuthRef.current = null;

      if (!pending) return;

      await signIn(pending.token, pending.user);
      router.replace("/(tabs)");
    }, [signIn]);


  const onRegister = async () => {
    Keyboard.dismiss();

    if (!username || !email || !password) {
      Alert.alert("Missing info", "Username, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too hackable friend!",
        "Pls use at least 8 characters of your choosing."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRegister(username, email, password);

      pendingAuthRef.current = { token: data.token, user: data.user || null };

      setToastMsg("Poof! Account created ✨");
      setToastVisible(true);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? String(err));
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
        <WizardTitle>Welcome muggle!</WizardTitle>
        <WizardBody>Create your account:</WizardBody>

        <WizardInput
          value={username}
          onChangeText={setUsername}
          placeholder="username"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          style={styles.input}
        />

        <WizardInput
          ref={emailRef}
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
          onSubmitEditing={onRegister}
          style={styles.input}
        />

        <WizardButton style={styles.button} onPress={onRegister} loading={loading}>
          <WizardBody style={[styles.buttonText, {color:theme.primaryText}]}>{loading ? "1...2...3..." : "Poof!"}</WizardBody>
        </WizardButton>

        <WizardBody style={styles.linkRow}>
          Already met the wizard? Log in{" "}
          <Link href="/(auth)/login" style={[styles.link, { color: theme.accent2 }]}>
            here!
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
  button: {
    width: "100%",
    marginTop: 12,
  },
  buttonText: { fontSize: 16, fontWeight: "600", marginTop: 0 },
  linkRow: { marginTop: 8, fontSize: 14 },
  link: {},
});
