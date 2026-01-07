import { API_BASE_URL } from "../../app/config/api";
import type { Recipe } from "../types/recipe";

export type GenerateResponse = {
  recipes: Recipe[];
};

export async function generateRecipes(
  pantryText: string
): Promise<GenerateResponse> {
  console.log("AI request to:", `${API_BASE_URL}/api/generate`);
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
