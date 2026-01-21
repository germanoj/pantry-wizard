import { saveRecipe } from "./savedRecipes";
import type { Recipe as ApiRecipe } from "../types/recipe";

const savedKeys = new Set<string>();

export function hasSaved(key: string) {
  return savedKeys.has(key);
}

export type UiRecipe = {
  id?: string;
  title: string;
  time: string;
  ingredients?: string[];
  steps?: string[];
  imageUrl?: string;
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
    ...(item.id ? ({ id: item.id } as any) : {}),
    title: item.title,
    ingredientsUsed: item.ingredients ?? [],
    missingIngredients: [],
    steps: item.steps ?? [],
    timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
    ...(item.imageUrl ? ({ imageUrl: item.imageUrl } as any) : {}),
  };

  await saveRecipe(payload);

  if (item.id) savedKeys.add(item.id);
}
