import { API_BASE_URL } from "../config/api";
import type { Recipe } from "../types/recipe";
import * as SecureStore from "expo-secure-store";

// Helper: get auth token (no top-level await)
async function getToken() {
  return await SecureStore.getItemAsync("authToken");
}

// Optional helper for debugging (call this from a screen or button)
export async function logAuthTokenPresence() {
  const token = await getToken();
  console.log("🪙 authToken in SecureStore:", token ? "YES" : "NO");
  return !!token;
}

export async function saveRecipe(recipe: Recipe) {
  const recipeToSave: any = { ...recipe };

  // Strip base64 images before sending to backend
  if (
    typeof recipeToSave.imageUrl === "string" &&
    recipeToSave.imageUrl.startsWith("data:image/")
  ) {
    recipeToSave.imageUrl = null;
  }

  const token = await getToken();
  if (!token) throw new Error("Not logged in (no token found)");

  const res = await fetch(`${API_BASE_URL}/api/user-recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipe: recipeToSave }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text) as { ok: boolean; recipeId: string };
}

export async function fetchSavedRecipes() {
  const token = await getToken();
  if (!token) throw new Error("Not logged in (no token found)");

  const res = await fetch(`${API_BASE_URL}/api/user-recipes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text) as {
    recipes: Array<Recipe & { id: string; savedAt: string }>;
  };
}

export async function deleteSavedRecipe(savedRecipeId: string) {
  const token = await getToken();
  if (!token) throw new Error("Not logged in (no token found)");

  const res = await fetch(`${API_BASE_URL}/api/user-recipes/${savedRecipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text) as { ok: boolean };
}
