import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";

import { useTheme } from "@/src/theme/usetheme";
import { WizardBody, WizardTitle, WizardInput, WizardButton } from "@/src/components/WizardText";
import { Card } from "@/src/components/Card";

import { apiRegister } from "@/src/auth/library";
// If you want auto-login after register, uncomment:
import { useAuth } from "@/src/auth/AuthContext";

export default function RegisterPage() {
  const theme = useTheme();

  const [username, setUsername] = useState(""); // NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If you want auto-login after register, uncomment:
  const { signIn } = useAuth();

  const onRegister = async () => {
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

    //console.log("Registering:", { username, email });
    const data = await apiRegister(username, email, password);
    //console.log("Register success:", data);
    await signIn(data.token);
        Alert.alert("Poof!", "Your account has been created. Let's get cookin'!", [
          { text: "OK", onPress: () => router.replace("/(tabs)")},
        ]);
  
  } catch (err: any) {
    //console.log("Register error:", err);
    Alert.alert("Error", err?.message || String(err));
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <WizardTitle>Welcome muggle!</WizardTitle>
        <WizardBody>Create your account:</WizardBody>

        <WizardInput
          value={username}
          onChangeText={setUsername}
          placeholder="username"
          autoCapitalize="none"
          style={styles.input}
        />

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

        <WizardButton style={styles.button} onPress={onRegister} disabled={loading}>
          <WizardBody style={[styles.buttonText, {color:theme.primaryText}]}>{loading ? "1...2...3..." : "Poof!"}</WizardBody>
        </WizardButton>

        <WizardBody style={styles.linkRow}>
          Already met the wizard? Log in{" "}
          <Link href="/(auth)/login" style={[styles.link, { color: theme.accent2 }]}>
            here!
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
  button: {
    width: "100%",
    marginTop: 12,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
  linkRow: { marginTop: 8, fontSize: 14 },
  link: {},
});
