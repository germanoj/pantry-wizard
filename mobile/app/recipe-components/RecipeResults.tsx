import { FlatList, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import RecipeCard from "./RecipeCard";
import { useNotInterested } from "../../state/NotInterestedContext";
import { saveRecipe } from "../../src/lib/savedRecipes";

export interface Recipe {
  id: string;
  title: string;
  time: string; // e.g. "25 min" or "25"
  image: any;
  description?: string;
  ingredients?: string[]; // (your UI field)
  steps?: string[];
}

interface Props {
  recipes: Recipe[];
  cardHeight?: number;
}

function parseMinutes(time: string | number | undefined | null) {
  if (typeof time === "number") return time;
  if (!time) return 0;

  // grabs first number from strings like "25 min", "30", "Ready in 15 minutes"
  const match = String(time).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function RecipeResults({ recipes, cardHeight }: Props) {
  const router = useRouter();

  // ✅ Use shared state from context (teammate)
  const { isNotInterested, toggleNotInterested } = useNotInterested();

  // ✅ Save recipe (you)
  async function handleSave(item: Recipe) {
    try {
      const timeMinutes = parseMinutes(item.time);

      await saveRecipe({
        title: item.title,
        ingredientsUsed: item.ingredients ?? [],
        missingIngredients: [],
        steps: item.steps ?? [],
        timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
      });

      Alert.alert("Saved!", `"${item.title}" was saved.`);
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Could not save recipe.");
    }
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
      style={{ flex: 1 }}
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
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: item.id },
              })
            }
            onSave={() => handleSave(item)}
          />
        </View>
      )}
    />
  );
}
