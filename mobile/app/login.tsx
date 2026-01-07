import { useState } from "react";
import { Text, View, StyleSheet, Alert, TextInput, Pressable } from "react-native";
import { Link, router } from "expo-router";

import { mockLogin } from "../library/auth"; // adjust if your auth file lives elsewhere

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await mockLogin(email, password);

      Alert.alert("Welcome back!", "You're logged in. Let's get cookin'!");
      router.replace("/profile");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Hmm the magic isn't magic-ing... login failed. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Casting spell..." : "Accio!"}</Text>
      </Pressable>

      <Text style={styles.linkRow}>
        First time visiting the wizard? <Link href="/register">Create an account</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10 },
  input: { width: "25%", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16, marginTop: 10 },
  button: { width: "25%", backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkRow: { marginTop: 12, fontSize: 14 },
});