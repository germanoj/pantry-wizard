import { Text, View, StyleSheet, Button } from "react-native";
import { router } from "expo-router";


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pantry Wizard 🧙‍♂️</Text>
    <Button
        title="Login to your account"
        onPress={() => router.push("/login")}
      />
     <Button
        title="Or visit the wizard as a guest"
        onPress={() => router.push("/chatBot")}
      />
    </View>
  );
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
});
