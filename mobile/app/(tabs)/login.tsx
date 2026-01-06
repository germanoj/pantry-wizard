import { Text, View, StyleSheet } from 'react-native';

import {Link} from 'expo-router'
/*if logged in do not need to see this page*/

export default function LoginPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text>Login to check your fave recipes</Text> {/*add login form here*/}
            <Text style={styles.title}>First time using Pantry Wizard?</Text> 
            <Text>Click <Link style={styles.link} href="/register">here</Link> to make an account to save all your unique recipes!</Text> {/*add register redirect/form here*/}
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
  link: {color: "blue"}
});
