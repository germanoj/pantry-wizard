import React, { useMemo } from "react";
import { Text } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import SingleRecipeCard from "@/src/components/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";
import { saveUiRecipe } from "@/src/lib/saveRecipeAction";
import { useGeneratedRecipes } from "@/src/state/GeneratedRecipesContext";

type UiRecipeShape = {
  id: string;
  title: string;
  time: string;
  image: any; // SingleRecipeCard expects "any" (RN Image source)
  description: string;
  ingredients: string[];
  steps: string[];
};

export default function CookRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Array.isArray(id) ? id[0] : id;

  const { recipes: generatedRecipes } = useGeneratedRecipes();

  const recipe = useMemo<UiRecipeShape | undefined>(() => {
    // 1) Try generated recipe first
    const fromGenerated = generatedRecipes?.find((r) => r._id === recipeId);
    if (fromGenerated) {
      return {
        id: fromGenerated._id,
        title: fromGenerated.title ?? "Untitled",
        time: fromGenerated.timeMinutes
          ? `${fromGenerated.timeMinutes} min`
          : "",
        image: fromGenerated.imageUrl ? { uri: fromGenerated.imageUrl } : null,
        description: "", // generated recipe doesn't have one
        ingredients: Array.isArray(fromGenerated.ingredientsUsed)
          ? fromGenerated.ingredientsUsed
          : [],
        steps: Array.isArray(fromGenerated.steps) ? fromGenerated.steps : [],
      };
    }

    // 2) Fallback to mock recipe
    const fromMock = MOCK_RECIPES.find((r) => r.id === recipeId);
    if (!fromMock) return undefined;

    return {
      id: fromMock.id,
      title: fromMock.title,
      time: fromMock.time,
      image: fromMock.image,
      description: fromMock.description,
      ingredients: fromMock.ingredients,
      steps: fromMock.steps,
    };
  }, [generatedRecipes, recipeId]);

  if (!recipe) return null;

  return (
    <>
      {/* Consider headerShown: true if you want an easy back button */}
      <Stack.Screen options={{ headerShown: false }} />

      <Text
        style={{ fontSize: 22, padding: 16, backgroundColor: "yellow" as any }}
      >
        COOK SCREEN DEBUG
      </Text>

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
            id: recipe.id,
            title: recipe.title,
            time: recipe.time,
            image: recipe.image,
            description: recipe.description,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
          } as any)
        }
        bottomSecondaryActionLabel="Cook Something New"
        onBottomSecondaryAction={() => {
          router.replace("/(tabs)/chatBot");
        }}
      />
    </>
  );
}
