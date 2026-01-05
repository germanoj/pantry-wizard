import { Text, View, StyleSheet } from 'react-native';
/*if logged in do not see this page*/

export default function ProfilePage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back, user!</Text>
            <Text>Here are the recipes you've tried in the past:</Text>
            <Text>Ready to try a new recipe? Visit the wizard & let's get cookin'!</Text> 
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
