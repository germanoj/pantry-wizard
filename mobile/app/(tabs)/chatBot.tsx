import { Text, View, StyleSheet } from 'react-native';

export default function chatBot() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Time to whip you up a magical recipe!</Text>
            <Text>Click below to get started</Text>
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
});
