import { FlatList, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import RecipeCard from "./RecipeCard";
import { useNotInterested } from "../../state/NotInterestedContext";
import { saveRecipe } from "../../src/lib/savedRecipes";
import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { saveUiRecipe } from "../../src/lib/saveRecipeAction";

export interface Recipe {
  id: string;
  title: string;
  time: string; // e.g. "25 min" or "25"
  image?: any;
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

interface Props {
  recipes: Recipe[];
  cardHeight?: number;
}

function parseMinutes(time: string | number | undefined | null) {
  if (typeof time === "number") return time;
  if (!time) return 0;
  const match = String(time).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function RecipeResults({ recipes, cardHeight }: Props) {
  const router = useRouter();
  const { isNotInterested, toggleNotInterested } = useNotInterested();
  const theme = useTheme();

  async function handleSave(item: Recipe) {
    await saveUiRecipe({
      title: item.title,
      time: item.time,
      ingredients: item.ingredients,
      steps: item.steps,
    });
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: ui.spacing.md,
        paddingBottom: ui.spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <View style={cardHeight ? { height: cardHeight } : undefined}>
          <RecipeCard
            title={item.title}
            time={item.time}
            image={item.image}
            style={{ flex: 1 }}
            isNotInterested={isNotInterested(item.id)}
            onToggleNotInterested={() => toggleNotInterested(item.id)}
            onMakeNow={() =>
              router.push({
                pathname: "/recipe/[id]/cook",
                params: { id: item.id },
              })
            }
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: item.id },
              })
            }
            onSaveForLater={() => handleSave(item)}
          />
        </View>
      )}
    />
  );
}
