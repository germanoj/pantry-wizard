import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { generateRecipes } from "../lib/apiClient";
import type { Recipe } from "../types/recipe";

import { useTheme } from "@/src/theme/usetheme";
import { WizardBody, WizardTitle } from "@/src/components/WizardText";
import { GeneratedRecipeCard } from "@/src/components/GeneratedRecipeCard";
import { useGeneratedRecipes } from "@/src/state/GeneratedRecipesContext";

export default function GenerateScreen() {
  const [pantryText, setPantryText] = useState("pasta, garlic, olive oil");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const router = useRouter();
  const { recipes, setRecipes } = useGeneratedRecipes();

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const data = await generateRecipes(pantryText);

      // ✅ add client-side id because Recipe type has none
      const withIds = (data.recipes || []).map((r: Recipe, i: number) => ({
        ...r,
        _id: `${Date.now()}-${i}`,
      }));

      setRecipes(withIds);
    } catch (e) {
      console.log("AI error:", e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
        {recipes.slice(0, 3).map((r) => (
          <GeneratedRecipeCard
            key={r._id}
            recipe={r}
            onPress={() => router.push(`/recipe/${r._id}`)}
          />
        ))}
      </View>

      {recipes.length > 0 && (
        <WizardBody
          style={{
            color: theme.textMuted,
            textAlign: "center",
            fontSize: 13,
            marginTop: 6,
          }}
        >
          Tap a recipe to see full steps
        </WizardBody>
      )}

      {!loading && !error && recipes.length === 0 ? (
        <WizardBody style={styles.emptyText}>
          Hmm no recipes yet... Try tapping the summon button.
        </WizardBody>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
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
    flex: 1,
  },
});
