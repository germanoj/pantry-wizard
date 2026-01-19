import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { fetchSavedRecipes } from "../../../../src/lib/savedRecipes";
import type { Recipe } from "../../../../src/types/recipe";

type SavedRecipe = Recipe & { id: string; savedAt: string };

export default function SavedRecipeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSavedRecipes();
        if (!cancelled) setRecipes(data.recipes ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load recipe");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const recipe = useMemo(() => recipes.find((r) => r.id === id), [recipes, id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading recipe…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "crimson" }}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Saved Recipe" }} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10 }}>Loading recipe…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "crimson" }}>{error}</Text>
        </View>
      ) : !recipe ? (
        <View style={styles.center}>
          <Text>Recipe not found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{recipe.title}</Text>

          {!!recipe.imageUrl && (
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
          )}

          <Text style={styles.meta}>
            Time: {recipe.timeMinutes ? `${recipe.timeMinutes} min` : "—"}
          </Text>

          <Section title="Ingredients">
            {recipe.ingredientsUsed?.length ? (
              recipe.ingredientsUsed.map((x, i) => <Text key={i}>• {x}</Text>)
            ) : (
              <Text>—</Text>
            )}
          </Section>

          <Section title="Missing">
            {recipe.missingIngredients?.length ? (
              recipe.missingIngredients.map((x, i) => (
                <Text key={i}>• {x}</Text>
              ))
            ) : (
              <Text>Nothing missing 🎉</Text>
            )}
          </Section>

          <Section title="Steps">
            {recipe.steps?.length ? (
              recipe.steps.map((x, i) => (
                <Text key={i}>
                  {i + 1}. {x}
                </Text>
              ))
            ) : (
              <Text>—</Text>
            )}
          </Section>
        </ScrollView>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: 16, gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ gap: 6 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700" },
  meta: { marginTop: 10, opacity: 0.7 },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
});
