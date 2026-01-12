import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

import { generateRecipes } from "../lib/apiClient";
import type { Recipe } from "../types/recipe";
import { RecipeCard } from "../components/RecipeCard";

import { useTheme } from '@/src/theme/usetheme';
import { WizardBody, WizardTitle } from '@/src/components/WizardText';
import { Card } from '@/src/components/Card';


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
      console.log("AI response keys:", Object.keys(data || {}));
      console.log(
        "First recipe imageUrl:",
        data?.recipes?.[0]?.imageUrl,
        "status:",
        data?.recipes?.[0]?.imageUrl ? "HAS_URL" : "NO_URL"
      );
      console.log(
        "Full first recipe:",
        JSON.stringify(data?.recipes?.[0], null, 2)
      );

      setRecipes(data.recipes);
    } catch (e) {
      console.log("AI error:", e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.background}]}>
      <WizardTitle>Summon a Recipe</WizardTitle>

      <TextInput
        value={pantryText}
        onChangeText={setPantryText}
        placeholder="Enter the pantry items you currently have:"
        style={styles.input}
        multiline
      />

      <Pressable style={styles.button} onPress={onGenerate} disabled={loading}>
        <WizardBody style={styles.buttonText}>
          {loading ? "Brewing..." : "Summon!"}
        </WizardBody>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.results}>
        {recipes.map((r, idx) => (
          <RecipeCard key={`${r.title}-${idx}`} recipe={r} />
        ))}
      </View>

      {!loading && !error && recipes.length === 0 ? (
        <WizardBody style={styles.emptyText}>Hmm no recipes yet... Try tapping the summon button.</WizardBody>
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
});
