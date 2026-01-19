import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import {
  fetchSavedRecipes,
  deleteSavedRecipe,
} from "../../src/lib/savedRecipes";

import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { Card } from "@/src/components/Card";
import {
  WizardBody,
  WizardTitle,
  WizardButton,
} from "@/src/components/WizardText";

type SavedRecipe = {
  id: string;
  savedAt: string;
  title: string;
  ingredientsUsed?: string[];
  missingIngredients?: string[];
  steps?: string[];
  timeMinutes?: number;
  imageUrl?: string;
};

export default function SavedRecipes() {
  const theme = useTheme();

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
            const prev = recipes;
            setRecipes((r) => r.filter((x) => x.id !== id));

            try {
              await deleteSavedRecipe(id);
            } catch (e: any) {
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

      const data = await fetchSavedRecipes();
      setRecipes(data.recipes ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved])
  );

  const Header = (
    <View style={{ marginBottom: ui.spacing.md }}>
      <WizardTitle>Saved recipes</WizardTitle>
      <WizardBody style={{ marginTop: 6, opacity: 0.9 }}>
        {recipes.length} recipe{recipes.length === 1 ? "" : "s"} saved
      </WizardBody>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          {Header}
          <View style={styles.center}>
            <ActivityIndicator />
            <WizardBody style={{ marginTop: 10 }}>
              Loading saved recipes…
            </WizardBody>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          {Header}
          <Card>
            <WizardBody style={{ color: theme.danger }}>{error}</WizardBody>

            <WizardButton style={{ marginTop: 12 }} onPress={loadSaved}>
              <WizardBody
                style={{ color: theme.text /* readable on primary */ }}
              >
                Try again
              </WizardBody>
            </WizardButton>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: ui.spacing.xl ?? ui.spacing.lg },
        ]}
        ListHeaderComponent={Header}
        ItemSeparatorComponent={() => (
          <View style={{ height: ui.spacing.md }} />
        )}
        ListEmptyComponent={
          <Card>
            <WizardTitle>No saved recipes yet</WizardTitle>
            <WizardBody style={{ marginTop: 8 }}>
              Save something from your recipe results to see it here.
            </WizardBody>

            <WizardButton
              style={{ marginTop: 12 }}
              onPress={() => router.replace("/(tabs)/recipes")}
            >
              <WizardBody style={{ color: theme.text }}>
                Go to recipes
              </WizardBody>
            </WizardButton>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/saved/(details)/${item.id}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
          >
            <Card>
              <View style={styles.row}>
                {!!item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                )}

                <View style={{ flex: 1 }}>
                  <WizardTitle style={{ marginTop: 0 }}>
                    {item.title}
                  </WizardTitle>

                  {!!item.timeMinutes && (
                    <WizardBody style={{ marginTop: 6, opacity: 0.85 }}>
                      {item.timeMinutes} min
                    </WizardBody>
                  )}
                </View>

                {/* Inline action: avoids nested WizardButton press issues on web */}
                <Pressable
                  onPress={() => onDeleteRecipe(item.id)}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.removePill,
                    {
                      borderColor: theme.danger,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <WizardBody style={{ marginTop: 0, color: theme.danger }}>
                    Remove
                  </WizardBody>
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: ui.spacing.md,
    paddingTop: ui.spacing.md,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  removePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
});
