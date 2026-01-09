import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { fetchSavedRecipes } from "../../src/lib/savedRecipes"; // adjust path if needed

type SavedRecipe = {
  id: string;
  savedAt: string;
  title: string;
  ingredientsUsed?: string[];
  missingIngredients?: string[];
  steps?: string[];
  timeMinutes?: number;
};

export default function SavedRecipes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchSavedRecipes(); // { recipes: [...] }
        if (!cancelled) setRecipes(data.recipes ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load saved recipes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading saved recipes…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Saved Recipes</Text>
        <Text style={{ marginTop: 10, color: "crimson" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here are your saved recipes:</Text>

      {recipes.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No saved recipes yet.</Text>
      ) : (
        <FlatList
          style={{ marginTop: 12, width: "100%" }}
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!!item.timeMinutes && (
                <Text style={styles.cardMeta}>{item.timeMinutes} min</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardMeta: {
    marginTop: 6,
    opacity: 0.7,
  },
});
