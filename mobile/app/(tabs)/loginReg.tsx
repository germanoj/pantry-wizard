/*if logged in do not need to see this page*/

import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/usetheme';
import { Link } from 'expo-router'
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';

export default function LoginPage() {
  const theme = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <Card>
              <WizardTitle>Welcome back!</WizardTitle>
              <WizardBody> <Link style={[styles.link, {color: theme.accent}]} href="/login">Login </Link>to check your fave recipes</WizardBody> {/*add login form here*/}
              <WizardTitle>First time using Pantry Wizard?</WizardTitle> 
              <WizardBody>Click <Link style={[styles.link, {color: theme.accent}]} href="/register">here</Link> to make an account to save all your unique recipes!</WizardBody> {/*add register redirect/form here*/}
            </Card>
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
    fontFamily: "YuseiMagic"
  },
  text: {
    fontFamily: "Nunito"
  },
  link: {color: "theme.accent"
  },
  card: {
  width: "100%",
  maxWidth: 420,
  padding: 18,
  borderRadius: 22,
  borderWidth: 1,
},

});
