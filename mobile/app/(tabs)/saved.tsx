import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useRouter } from "expo-router";
import {
  fetchSavedRecipes,
  deleteSavedRecipe,
} from "../../src/lib/savedRecipes"; // adjust path if needed

type SavedRecipe = {
  id: string;
  savedAt: string;
  title: string;
  ingredientsUsed?: string[];
  missingIngredients?: string[];
  steps?: string[];
  timeMinutes?: number;
  imageUrl?: string; // (optional, if you have it)
};

export default function SavedRecipes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  const onDeleteRecipe = (id: string) => {
    Alert.alert(
      "Remove recipe?",
      "This will delete it from your saved recipes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            // optimistic update
            const prev = recipes;
            setRecipes((r) => r.filter((x) => x.id !== id));

            try {
              await deleteSavedRecipe(id);
            } catch (e: any) {
              // rollback on failure
              setRecipes(prev);
              setError(e?.message ?? "Failed to delete recipe");
            }
          },
        },
      ]
    );
  };

  const loadSaved = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchSavedRecipes(); // { recipes: [...] }
      setRecipes(data.recipes ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load (mount)
  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  // refresh whenever tab/screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved])
  );

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
            <Pressable
              onPress={() => router.push(`/saved/(details)/${item.id}`)}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.row}>
                {!!item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                )}

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {!!item.timeMinutes && (
                    <Text style={styles.cardMeta}>{item.timeMinutes} min</Text>
                  )}
                </View>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onDeleteRecipe(item.id);
                  }}
                  hitSlop={10}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <Text style={{ color: "crimson", fontWeight: "600" }}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </Pressable>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
});
