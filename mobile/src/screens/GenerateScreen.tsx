import { useMemo, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { generateRecipes } from "../lib/apiClient";
import type { Recipe } from "../types/recipe";

import { useTheme } from "@/src/theme/usetheme";
import {
  WizardBody,
  WizardTitle,
  WizardInput,
  WizardButton,
} from "@/src/components/WizardText";
import { GeneratedRecipeCard } from "@/src/components/GeneratedRecipeCard";
import { useGeneratedRecipes } from "@/src/state/GeneratedRecipesContext";
import AiLoadingOverlay from "@/src/components/AiLoadingOverlay";

type MealType =
  | "no_preference"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack";

export default function GenerateScreen() {
  const [pantryText, setPantryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ preferences
  const [mealType, setMealType] = useState<MealType>("no_preference");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [maxTimeMinutes, setMaxTimeMinutes] = useState(""); // keep as string for TextInput
  const [maxIngredients, setMaxIngredients] = useState(""); // keep as string for TextInput

  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { recipes, setRecipes, clearRecipes } = useGeneratedRecipes();

  const mealOptions: Array<{ label: string; value: MealType }> = useMemo(
    () => [
      { label: "No preference", value: "no_preference" },
      { label: "Breakfast", value: "breakfast" },
      { label: "Lunch", value: "lunch" },
      { label: "Dinner", value: "dinner" },
      { label: "Dessert", value: "dessert" },
      { label: "Snack", value: "snack" },
    ],
    []
  );

  // ✅ When you return to this screen (back swipe -> forward),
  // reset BOTH the form and the results so you don't get empty inputs + old images.
  useFocusEffect(
    useCallback(() => {
      clearRecipes();
      setPantryText("");
      setMealType("no_preference");
      setDietaryRestrictions("");
      setMaxTimeMinutes("");
      setMaxIngredients("");
      setError(null);
      setLoading(false);
    }, [clearRecipes])
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
    clearRecipes(); // ✅ reset results immediately (cards/images)

    try {
      const preferences = {
        mealType,
        dietaryRestrictions: dietaryRestrictions.trim(),
        maxTimeMinutes: parseOptionalInt(maxTimeMinutes),
        maxIngredients: parseOptionalInt(maxIngredients),
      };

      const data = await generateRecipes(pantryText, preferences);

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
      {/* ✅ Native-only loading overlay (avoids lottie issues on web) */}
      {loading && Platform.OS !== "web" && <AiLoadingOverlay />}

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        showsVerticalScrollIndicator={false}
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
                <WizardButton
                  key={opt.value}
                  onPress={() => setMealType(opt.value)}
                  variant="surface"
                  fullWidth={false}
                  style={({ pressed }) => [
                    styles.pill,
                    {
                      borderColor: selected ? theme.text : theme.border,
                      backgroundColor: selected
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                    },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <WizardBody
                    style={{
                      color: theme.text,
                      fontSize: 13,
                      fontWeight: selected ? "700" : "600",
                      marginTop: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      lineHeight: 14,
                      textAlignVertical: "center",
                    }}
                  >
                    {opt.label}
                  </WizardBody>
                </WizardButton>
              );
            })}
          </View>

          <WizardBody
            style={[styles.label, { color: theme.textMuted, marginTop: 10 }]}
          >
            Dietary restrictions / allergies (optional)
          </WizardBody>

          <WizardInput
            value={dietaryRestrictions}
            onChangeText={setDietaryRestrictions}
            placeholder="e.g. vegetarian, peanut allergy, halal"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { minHeight: 44, marginTop: 0 }]}
          />

          <View style={styles.inlineRow}>
            <View style={styles.inlineCol}>
              <WizardBody style={[styles.label, { color: theme.textMuted }]}>
                Max time in minutes (optional)
              </WizardBody>
              <WizardInput
                value={maxTimeMinutes}
                onChangeText={setMaxTimeMinutes}
                placeholder="e.g. 30"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { minHeight: 44, marginTop: 0 }]}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inlineCol}>
              <WizardBody style={[styles.label, { color: theme.textMuted }]}>
                Max ingredients (optional)
              </WizardBody>
              <WizardInput
                value={maxIngredients}
                onChangeText={setMaxIngredients}
                placeholder="e.g. 8"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { minHeight: 44, marginTop: 0 }]}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* ✅ Ingredients */}
        <View style={styles.section}>
          <WizardBody style={[styles.label, { color: theme.textMuted }]}>
            Ingredients (required)
          </WizardBody>

          <WizardInput
            value={pantryText}
            onChangeText={setPantryText}
            placeholder="Enter ingredients you want to use (separate by comma)"
            placeholderTextColor={theme.textMuted}
            style={styles.input}
            multiline
            textAlignVertical="top"
          />
        </View>

        <WizardButton
          onPress={onGenerate}
          loading={loading}
          variant="primary"
          fullWidth
          style={{ marginTop: 12 }}
        >
          <WizardBody
            style={{
              color: theme.primaryText,
              fontSize: 16,
              fontWeight: "700",
              textAlign: "center",
              width: "100%",
              marginTop: 0,
            }}
          >
            {loading ? "Brewing..." : "Summon!"}
          </WizardBody>
        </WizardButton>

        {error ? (
          <WizardBody style={{ color: "tomato", marginTop: 0 }}>
            {error}
          </WizardBody>
        ) : null}

        {!loading && !error && recipes.length === 0 ? (
          <WizardBody style={styles.emptyText}>
            Hmm no recipes yet... Try tapping the summon button.
          </WizardBody>
        ) : null}

        <View style={styles.results}>
          {recipes.slice(0, 3).map((r) => (
            <GeneratedRecipeCard
              key={r._id}
              recipe={r}
              onPress={() =>
                router.push({
                  pathname: "/recipe/[id]",
                  params: { id: r._id },
                })
              }
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  section: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  inlineCol: { flex: 1, gap: 6 },
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
    justifyContent: "center",
  },
  emptyText: {},
  results: { gap: 12, marginTop: 12 },
});
