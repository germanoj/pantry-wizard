import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle, WizardInput, WizardButton } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

import { useAuth } from "@/src/auth/AuthContext";
import { apiLogin } from "@/src/auth/library";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {signIn} = useAuth();

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiLogin(email, password);
      await signIn(data.token);           // this updates auth state
      Alert.alert("Welcome back!", "You're logged in. Let's get cookin'!");
      router.replace("/(tabs)/profile"); //can switch just to (tabs) so it open the tab homescreen
    } catch (err: any) {
      Alert.alert("Error", err.message || "Hmm the magic isn't magic-ing... login failed. Try again?");    } finally {
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
