import React, { useMemo } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import SingleRecipeCard from "@/app/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";
import { useNotInterested } from "@/state/NotInterestedContext";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const recipe = useMemo(() => MOCK_RECIPES.find((r) => r.id === id), [id]);

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
        isNotInterested={isNotInterested(recipe.id)}
        onToggleNotInterested={() => toggleNotInterested(recipe.id)}
      />
    </>
  );
}
