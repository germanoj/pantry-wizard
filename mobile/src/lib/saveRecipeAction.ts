import { Alert } from "react-native";
import { saveRecipe } from "./savedRecipes";
import type { Recipe as ApiRecipe } from "../types/recipe";

type UiRecipe = {
  title: string;
  time: string; // e.g. "25 min"
  ingredients?: string[];
  steps?: string[];
};

function parseMinutes(time: string | number | undefined | null) {
  if (typeof time === "number") return time;
  if (!time) return 0;
  const match = String(time).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export async function saveUiRecipe(item: UiRecipe) {
  const timeMinutes = parseMinutes(item.time);

  const payload: ApiRecipe = {
    title: item.title,
    ingredientsUsed: item.ingredients ?? [],
    missingIngredients: [], // later: compute this
    steps: item.steps ?? [],
    timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
  };

  try {
    await saveRecipe(payload);
    Alert.alert("Saved!", `"${item.title}" was saved.`);
  } catch (e: any) {
    Alert.alert("Save failed", e?.message ?? "Could not save recipe.");
    throw e;
  }
}
