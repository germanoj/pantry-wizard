import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

// TODO: adjust these imports to match your project
// If you already have apiLogin + signIn elsewhere, keep those and remove these placeholders.
import { apiLogin } from "../../src/auth/library"; // <-- change if path differs
import { useAuth } from "../../src/auth/AuthContext"; // <-- change if path differs

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(email, password);

      // depending on your api response shape
      await signIn(data.token, data.user ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />

      {!!error && <Text style={{ color: "red" }}>{error}</Text>}

      <Pressable
        onPress={onLogin}
        disabled={loading}
        style={{
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
          borderWidth: 1,
          borderColor: "#333",
        }}
      >
        <Text>{loading ? "Signing in..." : "Sign in"}</Text>
      </Pressable>
    </View>
  );
}
