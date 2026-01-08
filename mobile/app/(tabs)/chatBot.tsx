import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function chatBot() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time to whip you up a magical recipe!</Text>
      <Text>Click below to get started</Text>
      <Link href="/generate">
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Visit the Wizard</Text>{" "}
          {/*change the wording in generate stack*/}
        </Pressable>
      </Link>
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
});
