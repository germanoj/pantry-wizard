export type Recipe = {
  title: string;
  ingredientsUsed: string[];
  missingIngredients?: string[];
  steps: string[];
  timeMinutes: number;
  imageUrl?: string | null;
  imagePrompt?: string;
};
