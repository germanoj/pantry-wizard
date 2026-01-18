import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import { generateRecipes } from "../lib/apiClient";
import type { Recipe } from "../types/recipe";

import { useTheme } from "@/src/theme/usetheme";
import { WizardBody, WizardTitle } from "@/src/components/WizardText";
import { GeneratedRecipeCard } from "@/src/components/GeneratedRecipeCard";
import { useGeneratedRecipes } from "@/src/state/GeneratedRecipesContext";

type MealType =
  | "no_preference"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack";

export default function GenerateScreen() {
  const [pantryText, setPantryText] = useState("pasta, garlic, olive oil");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ preferences
  const [mealType, setMealType] = useState<MealType>("no_preference");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [maxTimeMinutes, setMaxTimeMinutes] = useState(""); // keep as string for TextInput
  const [maxIngredients, setMaxIngredients] = useState(""); // keep as string for TextInput

  const theme = useTheme();
  const router = useRouter();
  const { recipes, setRecipes } = useGeneratedRecipes();

  const mealOptions: Array<{ label: string; value: MealType }> = useMemo(
    () => [
      { label: "No pref", value: "no_preference" },
      { label: "Breakfast", value: "breakfast" },
      { label: "Lunch", value: "lunch" },
      { label: "Dinner", value: "dinner" },
      { label: "Dessert", value: "dessert" },
      { label: "Snack", value: "snack" },
    ],
    []
  );

  function parseOptionalInt(s: string): number | null {
    const n = Number(String(s).trim());
    if (!Number.isFinite(n)) return null;
    const i = Math.floor(n);
    return i > 0 ? i : null;
  }

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const preferences = {
        mealType,
        dietaryRestrictions: dietaryRestrictions.trim(),
        maxTimeMinutes: parseOptionalInt(maxTimeMinutes),
        maxIngredients: parseOptionalInt(maxIngredients),
      };

      // ✅ apiClient should accept 2nd arg now:
      // generateRecipes(pantryText, preferences)
      const data = await generateRecipes(pantryText, preferences);

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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <WizardTitle>Summon a Recipe</WizardTitle>

      {/* ✅ Preferences */}
      <View style={styles.section}>
        <WizardBody style={[styles.label, { color: theme.textMuted }]}>
          What kind of dish?
        </WizardBody>

        <View style={styles.pillsRow}>
          {mealOptions.map((opt) => {
            const selected = opt.value === mealType;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setMealType(opt.value)}
                style={[
                  styles.pill,
                  {
                    borderColor: selected ? theme.text : "#ddd",
                    backgroundColor: selected
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 13,
                    fontWeight: selected ? "700" : "600",
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <WizardBody
          style={[styles.label, { color: theme.textMuted, marginTop: 10 }]}
        >
          Dietary restrictions / allergies (optional)
        </WizardBody>
        <TextInput
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
          placeholder="e.g. vegetarian, peanut allergy, halal"
          placeholderTextColor="#888"
          style={[styles.input, { minHeight: 44 }]}
        />

        <View style={styles.inlineRow}>
          <View style={styles.inlineCol}>
            <WizardBody style={[styles.label, { color: theme.textMuted }]}>
              Max time (min)
            </WizardBody>
            <TextInput
              value={maxTimeMinutes}
              onChangeText={setMaxTimeMinutes}
              placeholder="e.g. 30"
              placeholderTextColor="#888"
              style={[styles.input, { minHeight: 44 }]}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inlineCol}>
            <WizardBody style={[styles.label, { color: theme.textMuted }]}>
              Max ingredients
            </WizardBody>
            <TextInput
              value={maxIngredients}
              onChangeText={setMaxIngredients}
              placeholder="e.g. 8"
              placeholderTextColor="#888"
              style={[styles.input, { minHeight: 44 }]}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      {/* ✅ Ingredients (main input stays at bottom) */}
      <View style={styles.section}>
        <WizardBody style={[styles.label, { color: theme.textMuted }]}>
          Ingredients
        </WizardBody>

        <TextInput
          value={pantryText}
          onChangeText={setPantryText}
          placeholder="Enter ingredients (comma or new lines)."
          placeholderTextColor="#888"
          style={styles.input}
          multiline
          textAlignVertical="top"
        />
      </View>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  inlineCol: {
    flex: 1,
    gap: 6,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
