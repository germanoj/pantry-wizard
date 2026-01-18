import { API_BASE_URL } from "../config/api";
import type { Recipe } from "../types/recipe";

export type GenerateResponse = {
  recipes: Recipe[];
};

export type GeneratePreferences = {
  mealType?: string;
  dietaryRestrictions?: string;
  maxTimeMinutes?: number | null;
  maxIngredients?: number | null;
};

export async function generateRecipes(
  pantryText: string,
  preferences?: GeneratePreferences
): Promise<GenerateResponse> {
  console.log("AI request to:", `${API_BASE_URL}/api/generate-ai`);

  const res = await fetch(`${API_BASE_URL}/api/generate-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pantryText,
      preferences, // ✅ new
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  return JSON.parse(text) as GenerateResponse;
}
