import { API_BASE_URL } from "../config/api";
import type { Recipe } from "../types/recipe";

export async function saveRecipe(recipe: Recipe) {
  const res = await fetch(`${API_BASE_URL}/api/user-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text) as { ok: boolean; recipeId: string };
}

export async function fetchSavedRecipes() {
  const res = await fetch(`${API_BASE_URL}/api/user-recipes`);
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text) as {
    recipes: Array<Recipe & { id: string; savedAt: string }>;
  };
}
