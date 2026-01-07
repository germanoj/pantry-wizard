import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import RecipeResults from "../recipe-components/RecipeResults";
import { MOCK_RECIPES } from "@/data/recipes";

export default function ChatBot() {
  const [recipes, setRecipes] = useState(MOCK_RECIPES);

  return (
    <View style={styles.container}>
      {/*Chatbot UI */}
      <View style={styles.chatContainer}>
        <Text style={styles.title}>Time to whip you up a magical recipe!</Text>
        <Text>Click below to get started</Text>
      </View>

      <RecipeResults recipes={recipes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  chatContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderBottomColor: "#b41111ff",
  },
});
