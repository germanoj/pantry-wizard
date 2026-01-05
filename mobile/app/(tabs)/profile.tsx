import { Text, View, StyleSheet } from "react-native";

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, user!</Text>
      <Text>Here are the recipes you&apos;ve tried in the past:</Text>
      <Text>
        Ready to try a new recipe? Visit the wizard & let&apos;s get
        cookin&apos;!
      </Text>
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
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});
