import React, { useMemo } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import SingleRecipeCard from "@/src/components/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";
import { saveUiRecipe } from "@/src/lib/saveRecipeAction";
import { useGeneratedRecipes } from "@/src/state/GeneratedRecipesContext";

export default function CookRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Array.isArray(id) ? id[0] : id;

  const { recipes: generatedRecipes } = useGeneratedRecipes();
  const recipe = useMemo(() => {
    const fromGenerated = generatedRecipes?.find((r) => r.id === recipeId);
    if (fromGenerated) return fromGenerated;
    return MOCK_RECIPES.find((r) => r.id === recipeId);
  }, [generatedRecipes, recipeId]);

  if (!recipe) return null;

  return (
    <>
      {/* Consider headerShown: true if you want an easy back button */}
      <Stack.Screen options={{ headerShown: false }} />

      <SingleRecipeCard
        title={recipe.title}
        time={recipe.time}
        image={recipe.image}
        description={recipe.description}
        ingredients={recipe.ingredients}
        steps={recipe.steps}
        showActions={false}
        bottomActionLabel="Save Recipe"
        onBottomAction={() =>
          saveUiRecipe({
            title: recipe.title,
            time: recipe.time,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
          })
        }
        bottomSecondaryActionLabel="Cook Something New"
        onBottomSecondaryAction={() => {
          // simplest: go back to the list
          router.replace("/(tabs)/chatBot");
        }}
      />
    </>
  );
}
