import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";

import {
  fetchSavedRecipes,
  deleteSavedRecipe,
} from "../../../../src/lib/savedRecipes";
import type { Recipe } from "../../../../src/types/recipe";

import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { Card } from "@/src/components/Card";
import {
  WizardBody,
  WizardTitle,
  WizardButton,
} from "@/src/components/WizardText";

type SavedRecipe = Recipe & { id: string; savedAt: string };

export default function SavedRecipeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSavedRecipes();
      setRecipes(data.recipes ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ simplified: single source of truth
  useEffect(() => {
    load();
  }, [load]);

  const recipe = useMemo(
    () => recipes.find((r) => String(r.id) === String(id)),
    [recipes, id]
  );

  const onRemove = useCallback(() => {
    if (!recipe) return;

    Alert.alert(
      "Remove from saved?",
      "This will delete it from your saved recipes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSavedRecipe(recipe.id);
              // always return to Saved Recipes tab
              router.replace("/(tabs)/saved");
            } catch (e: any) {
              Alert.alert("Error", e?.message ?? "Failed to remove recipe");
            }
          },
        },
      ]
    );
  }, [recipe]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: "Saved Recipe" }} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <WizardBody style={{ marginTop: 10 }}>Loading recipe…</WizardBody>
        </View>
      ) : error ? (
        <View style={styles.content}>
          <Card>
            <WizardTitle style={{ marginTop: 0 }}>
              Couldn’t load recipe
            </WizardTitle>
            <WizardBody style={{ marginTop: 8, color: theme.danger }}>
              {error}
            </WizardBody>

            <WizardButton style={{ marginTop: 12 }} onPress={load}>
              <WizardBody style={{ color: theme.text }}>Try again</WizardBody>
            </WizardButton>

            <WizardButton
              style={{ marginTop: 10 }}
              onPress={() => router.replace("/(tabs)/saved")}
            >
              <WizardBody style={{ color: theme.text }}>Back</WizardBody>
            </WizardButton>
          </Card>
        </View>
      ) : !recipe ? (
        <View style={styles.content}>
          <Card>
            <WizardTitle style={{ marginTop: 0 }}>Recipe not found</WizardTitle>
            <WizardBody style={{ marginTop: 8 }}>
              This saved recipe may have been deleted.
            </WizardBody>

            <WizardButton
              style={{ marginTop: 12 }}
              onPress={() => router.replace("/(tabs)/saved")}
            >
              <WizardBody style={{ color: theme.text }}>Back</WizardBody>
            </WizardButton>
          </Card>
        </View>
      ) : (
        <ScrollView
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: ui.spacing.xl ?? ui.spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <WizardTitle style={{ marginTop: 0 }}>{recipe.title}</WizardTitle>

            {!!recipe.imageUrl && (
              <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
            )}

            <WizardBody style={{ marginTop: 10, opacity: 0.9 }}>
              Time: {recipe.timeMinutes ? `${recipe.timeMinutes} min` : "—"}
            </WizardBody>

            <WizardButton
              style={{ marginTop: 12 }}
              onPress={() => router.replace("/(tabs)/saved")}
            >
              <WizardBody style={{ color: theme.text }}>Back</WizardBody>
            </WizardButton>

            {/* Remove from saved */}
            <WizardButton
              style={{
                marginTop: 10,
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.danger,
              }}
              onPress={onRemove}
            >
              <WizardBody style={{ color: theme.danger }}>
                Remove from saved
              </WizardBody>
            </WizardButton>
          </Card>

          <Card style={{ marginTop: ui.spacing.md }} variant="list">
            <SectionTitle>Ingredients</SectionTitle>
            {recipe.ingredientsUsed?.length ? (
              recipe.ingredientsUsed.map((x, i) => (
                <WizardBody key={i} style={styles.bullet}>
                  • {x}
                </WizardBody>
              ))
            ) : (
              <WizardBody style={styles.bullet}>—</WizardBody>
            )}
          </Card>

          <Card style={{ marginTop: ui.spacing.md }} variant="list">
            <SectionTitle>Missing</SectionTitle>
            {recipe.missingIngredients?.length ? (
              recipe.missingIngredients.map((x, i) => (
                <WizardBody key={i} style={styles.bullet}>
                  • {x}
                </WizardBody>
              ))
            ) : (
              <WizardBody style={styles.bullet}>Nothing missing 🎉</WizardBody>
            )}
          </Card>

          <Card style={{ marginTop: ui.spacing.md }} variant="list">
            <SectionTitle>Steps</SectionTitle>
            {recipe.steps?.length ? (
              recipe.steps.map((x, i) => (
                <WizardBody key={i} style={styles.step}>
                  {i + 1}. {x}
                </WizardBody>
              ))
            ) : (
              <WizardBody style={styles.bullet}>—</WizardBody>
            )}
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <WizardTitle style={{ marginTop: 0, fontSize: 18 }}>{children}</WizardTitle>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    paddingHorizontal: ui.spacing.md,
    paddingTop: ui.spacing.md,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },
  bullet: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  step: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
  },
});
