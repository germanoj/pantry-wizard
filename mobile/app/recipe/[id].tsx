import { useLocalSearchParams, useRouter } from "expo-router";
import SingleRecipeCard from "@/app/recipe-components/SingleRecipeCard";
import { MOCK_RECIPES } from "@/data/recipes";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const recipe = MOCK_RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return null;
  }

  return (
    <SingleRecipeCard
      title={recipe.title}
      time={recipe.time}
      image={recipe.image}
      description={recipe.description}
      ingredients={recipe.ingredients}
      steps={recipe.steps}
      onBack={() => router.back()}
    />
  );
}
