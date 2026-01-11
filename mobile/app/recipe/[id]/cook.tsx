import React, { useMemo } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import SingleRecipeCard from "@/app/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";

export default function CookRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Array.isArray(id) ? id[0] : id;

  const recipe = useMemo(
    () => MOCK_RECIPES.find((r) => r.id === recipeId),
    [recipeId]
  );

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
        bottomActionLabel="Save this Recipe"
        onBottomAction={() => {
          // TODO: wire to saved recipes store + auth later
          console.log("Save recipe:", recipe.id);
        }}
      />
    </>
  );
}
