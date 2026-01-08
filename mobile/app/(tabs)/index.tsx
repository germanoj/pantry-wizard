import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pantry Wizard 🧙‍♂️</Text>
      <Text><Link style={styles.link} href="/(auth)/login">Login</Link> to see past recipes and ask the wize wizard for more food inspo</Text>
      <Text><Link style={styles.link} href="/(auth)/register">Register</Link> a new account</Text>
      <Text> Or visit the <Link style={styles.link} href="/(tabs)/chatBot">wizard</Link> as a guest</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
    link: {color: "blue"}
});
