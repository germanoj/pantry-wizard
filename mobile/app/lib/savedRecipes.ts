import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Recipe } from "../types/recipe";

const KEY = "SAVED_RECIPES";

export type SavedRecipe = Recipe & {
  savedAt: string;
};

export async function getSavedRecipes(): Promise<SavedRecipe[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveRecipe(recipe: Recipe) {
  const existing = await getSavedRecipes();

  const alreadySaved = existing.some((r) => r.title === recipe.title);
  if (alreadySaved) {
    console.log("Already saved:", recipe.title);
    return;
  }

  const updated: SavedRecipe[] = [
    { ...recipe, savedAt: new Date().toISOString() },
    ...existing,
  ];

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  console.log("Saved recipe:", recipe.title);
}

export async function removeRecipe(title: string) {
  const existing = await getSavedRecipes();
  const updated = existing.filter((r) => r.title !== title);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}
