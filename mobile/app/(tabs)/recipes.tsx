import { View, StyleSheet } from "react-native";
import RecipeResults from "../recipe-components/RecipeResults";
import { MOCK_RECIPES } from "@/data/recipes";

export default function RecipesTab() {
  return (
    <View style={styles.container}>
      <RecipeResults recipes={MOCK_RECIPES} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
