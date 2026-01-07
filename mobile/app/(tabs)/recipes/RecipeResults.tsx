import React from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "./RecipeCard";

const RECIPES = [
  {
    id: "1",
    title: "Chicken Stew with Cheerios and Broccoli",
    time: "20 min",
    image: require("../../../assets/images/pasta.png"),
    ingredients: [
      "Chicken",
      "Broccoli",
      "Cheerios",
      "Olive Oil",
      "Garlic",
      "Salt",
      "Pepper",
    ],
    summary:
      "A hearty and healthy chicken stew perfect for cold days.  This stew combines tender chicken pieces with fresh broccoli and crunchy Cheerios for a delightful texture. Simmered in a flavorful broth, it's a comforting meal that warms the soul.",
    steps: [
      "1. Heat olive oil in a large pot over medium heat.",
      "Add garlic and sauté until fragrant.",
      "2. Add chicken pieces and cook until browned on all sides.",
      "3. Pour in broth and bring to a boil.",
      "4. Reduce heat and let simmer for 15 minutes.",
      "5. Add broccoli and cook for an additional 5 minutes until tender.",
      "6. Stir in Cheerios just before serving for added crunch.",
      "7. Season with salt and pepper to taste. Serve hot.",
    ],
  },
  {
    id: "2",
    title: "Broccoli Chicken Salad with Crunch Dressing",
    time: "15 min",
<<<<<<< HEAD
    image: require("../../../assets/images/pasta.png"),
=======
    //image: require("../../../assets/images/pasta.png"),
>>>>>>> 8c805ef (added login page)
    ingredients: [
      "Chicken",
      "Broccoli",
      "Mayonnaise",
      "Greek Yogurt",
      "Apple Cider Vinegar",
      "lettuce",
      "honey",
      "salt",
      "pepper",
    ],
    summary:
      "A refreshing and healthy broccoli chicken salad with a unique crunch dressing. This salad combines tender chicken pieces with fresh broccoli and a tangy, crunchy dressing for a satisfying meal.",
    steps: [
      "1. In a large bowl, combine cooked chicken pieces and chopped broccoli.",
      "2. In a separate bowl, whisk together mayonnaise, Greek yogurt, apple cider vinegar, honey, salt, and pepper to create the dressing.",
    ],
  },
  {
    id: "3",
    title: "Crunchy Chicken and Broccoli Casserole",
    time: "30 min",
    image: require("../../../assets/images/pasta.png"),
    ingredients: [
      "Chicken",
      "Broccoli",
      "Cheerios",
      "Olive Oil",
      "Garlic",
      "Salt",
      "Pepper",
    ],
    summary:
      "A delicious and easy-to-make crunchy chicken and broccoli casserole. This dish features tender chicken pieces and fresh broccoli baked in a creamy sauce, topped with a crispy breadcrumb and cheese crust for added texture.",
    steps: [
      "1. Preheat oven to 375°F (190°C).",
      "2. In a large skillet, heat olive oil over medium heat. Add garlic and sauté until fragrant.",
      "3. Add chicken pieces and cook until browned on all sides.",
      "4. In a large bowl, combine cooked chicken, steamed broccoli, and your choice of creamy sauce (like a mix of cream of mushroom soup and sour cream).",
      "5. Transfer the mixture to a greased baking dish.",
    ],
  },
];

export default function RecipeResults() {
  return (
    <SafeAreaView style={styles.screen}>
      {/*Header with Back Button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      </View>

      {/* Recipe Previews */}
      <ScrollView contentContainerStyle={styles.list}>
        {RECIPES.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            time={recipe.time}
            image={recipe.image}
            onPress={() => console.log("Pressed:", recipe.title)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
  },
  list: {
    padding: 16,
    gap: 12,
  },
});
