import React, { useMemo } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import SingleRecipeCard from "@/src/components/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";
import { useNotInterested } from "@/state/NotInterestedContext";

import { saveUiRecipe } from "@/src/lib/saveRecipeAction";
import { useGeneratedRecipes } from "@/state/GeneratedRecipesContext";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { recipes: generatedRecipes } = useGeneratedRecipes();
  const recipe = useMemo(() => {
    const fromGenerated = generatedRecipes?.find((r) => r.id === id);
    if (fromGenerated) return fromGenerated;
    return MOCK_RECIPES.find((r) => r.id === id);
  }, [generatedRecipes, id]);

  const { isNotInterested, toggleNotInterested } = useNotInterested();

  if (!recipe) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SingleRecipeCard
        title={recipe.title}
        time={recipe.time}
        image={recipe.image}
        description={recipe.description}
        ingredients={recipe.ingredients}
        steps={recipe.steps}
        onMakeNow={() =>
          router.push({
            pathname: "/recipe/[id]/cook",
            params: { id: recipe.id },
          })
        }
        onSaveForLater={() =>
          saveUiRecipe({
            title: recipe.title,
            time: recipe.time,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
          })
        }
        isNotInterested={isNotInterested(recipe.id)}
        onToggleNotInterested={() => toggleNotInterested(recipe.id)}
      />
    </>
  );
}
