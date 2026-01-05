import type { Recipe } from "../types/recipe";

const API_BASE_URL = "http://10.0.11.159:3000";

export type GenerateResponse = {
  recipes: Recipe[];
};

export async function generateRecipes(
  pantryText: string
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pantryText }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  return JSON.parse(text) as GenerateResponse;
}
