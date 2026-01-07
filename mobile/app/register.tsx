import { useState } from 'react';
import { Text, View, StyleSheet, Alert, TextInput, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
/*if logged in do not need to see this page*/

import { mockRegister } from '@/library/auth';

//const API = process.env.EXPO_PUBLIC_API_URL;
//console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if(!email || !password) {
      Alert.alert("Email and password are required.");
      return;
    }

    if(password.length < 8) {
      Alert.alert("Password too hackable friend!", "Pls use at least 8 characters of your choosing.");
      return;
    }
  
  try {
    setLoading(true);

    await mockRegister(email, password);

    Alert.alert("Poof!", "Your account has been created. Log in and let's get cookin'!.");
    router.replace("/login");
  } catch(err:any) {
      Alert.alert("Error", err.message || "Registration failed :(");
  } finally {
      setLoading(false);
  }
};
/*    const res = await mockRegister(email, password, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({email,password}),
      })

      const data = await res.json();
      if(!res.ok) throw new Error(data)
    }*/
  return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome muggle!</Text>
            <Text style={styles.title}>Create your account:</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder='email'
              autoCapitalize='none'
              keyboardType='email-address'
              style={styles.input}
            />

            <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='password'
            secureTextEntry
            style={styles.input}
            />

            <Pressable style ={styles.button} onPress={onRegister} disabled={loading}>
              <Text style={styles.buttonText}>{loading? "Bibbity, bobbity..." : "Boo!"}</Text>
            </Pressable>

            <Text style={styles.linkRow}>
              Already met the wizard? Log in <Link style={styles.link} href="/login">here!</Link>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16 },
  button: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkRow: { marginTop: 8, fontSize: 14 },
  link: { color: "blue"}

});
