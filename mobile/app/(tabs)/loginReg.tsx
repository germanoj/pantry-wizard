import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/usetheme';
import {Link} from 'expo-router'
/*if logged in do not need to see this page*/

export default function LoginPage() {
  const theme = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.title, {color: theme.text}]}>Welcome back!</Text>
            <Text style={{color: theme.text}}> <Link style={styles.link} href="/login">Login </Link>to check your fave recipes</Text> {/*add login form here*/}
            <Text style={[styles.title, {color: theme.text}]}>First time using Pantry Wizard?</Text> 
            <Text style={{color: theme.text}}>Click <Link style={styles.link} href="/register">here</Link> to make an account to save all your unique recipes!</Text> {/*add register redirect/form here*/}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  link: {color: "#FFD36A"}
});
