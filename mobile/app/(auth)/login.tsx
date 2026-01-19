import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { router, Link } from "expo-router";

import { useAuth } from "@/src/auth/AuthContext";
import { apiLogin, apiReactivate } from "@/src/auth/library";

// These appear in your teammate's version; keep if they exist in your project
import { Card } from "@/src/components/Card";
import { WizardBody } from "@/src/components/WizardText";
import { WizardButton } from "@/src/components/WizardButton";
import { useTheme } from "@/src/theme/usetheme";

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [canReactivate, setCanReactivate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onLogin = async () => {
    setLoading(true);
    setCanReactivate(false);
    setErrorMsg(null);

    try {
      const data = await apiLogin(email, password);

      // ✅ critical: actually set auth state
      await signIn(data.token, data.user ?? null);

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

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
      <Card>
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
            marginTop: 12,
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
            marginTop: 12,
          }}
        />

        <WizardButton onPress={onLogin} disabled={loading} style={{ marginTop: 12 }}>
          <WizardBody style={{ color: theme.primaryText }}>
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
            style={{
              marginTop: 12,
              borderColor: theme.danger,
            }}
            onPress={async () => {
              try {
                setLoading(true);
                setErrorMsg(null);

                const data = await apiReactivate(email, password);

                await signIn(data.token, data.user ?? null);

                router.replace("/(tabs)/profile");
              } catch (err: any) {
                Alert.alert("Reactivation failed", err?.message ?? "Try again.");
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

        <WizardBody style={{ marginTop: 12 }}>
          First time visiting the wizard?{" "}
          <Link href="/register" style={{ color: theme.accent2 }}>
            Create an account
          </Link>
        </WizardBody>
      </Card>
    </View>
  );
}
