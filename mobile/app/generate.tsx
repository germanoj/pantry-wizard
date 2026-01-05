import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { generateRecipes } from "./lib/apiClient";

import type { Recipe } from "./types/recipe";
import { RecipeCard } from "./components/RecipeCard";

export default function GenerateScreen() {
  const [pantryText, setPantryText] = useState("pasta, garlic, olive oil");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipes(pantryText);
      setRecipes(data.recipes ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Recipes</Text>

      <TextInput
        value={pantryText}
        onChangeText={setPantryText}
        placeholder="Enter pantry items..."
        style={styles.input}
        multiline
      />

      <Pressable style={styles.button} onPress={onGenerate} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Generating..." : "Generate"}
        </Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.results}>
        {recipes.map((r, idx) => (
          <RecipeCard key={`${r.title}-${idx}`} recipe={r} />
        ))}
      </View>

      {!loading && !error && recipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes yet. Tap Generate.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
  },
  button: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "red",
  },
  emptyText: {
    color: "#666",
    marginTop: 8,
  },
  results: {
    gap: 12,
    marginTop: 8,
  },
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
});
