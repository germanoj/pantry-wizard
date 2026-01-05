import { Text, View, StyleSheet } from 'react-native';
/*only can see IF logged in*/

export default function SavedRecipes() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Here are your saved recipes:</Text>
            {/*saved recipes listed here*/}
        </View>
        /*
        if not logged in & if can see this page, prompt users to login/register 
        <View>  
            <Text>Login to check your fave recipes</Text> 
            <Text>First time using Pantry Wizard? Register an account and save your recipes!</Text> 
        </View>*/
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
