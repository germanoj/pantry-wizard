import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import type { Recipe } from "../types/recipe";
import { saveRecipe } from "../lib/savedRecipes";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{recipe.title}</Text>
        <Text style={styles.badge}>{recipe.timeMinutes} min</Text>
      </View>

      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Generating image…</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Using</Text>
      <Text style={styles.bodyText}>
        {recipe.ingredientsUsed.join(", ") || "—"}
      </Text>

      <Text style={styles.sectionLabel}>Missing</Text>
      <Text style={styles.bodyText}>
        {recipe.missingIngredients?.length
          ? recipe.missingIngredients.join(", ")
          : "Nothing 🎉"}
      </Text>

      <Text style={styles.sectionLabel}>Steps</Text>
      {recipe.steps.map((s, i) => (
        <Text key={i} style={styles.stepText}>
          {i + 1}. {s}
        </Text>
      ))}

      <Pressable
        style={styles.saveButton}
        onPress={async () => {
          await saveRecipe(recipe);
          alert("Saved!");
        }}
      >
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
  },
  sectionLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 14,
    color: "#222",
  },
  stepText: {
    fontSize: 14,
    color: "#222",
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  saveText: {
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginTop: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#777",
    fontWeight: "600",
  },
});
