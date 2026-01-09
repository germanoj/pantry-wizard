import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import RecipeCard from "./RecipeCard";
import { useNotInterested } from "../../state/NotInterestedContext";

export interface Recipe {
  id: string;
  title: string;
  time: string;
  image: any;
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

interface Props {
  recipes: Recipe[];
  cardHeight?: number;
}

export default function RecipeResults({ recipes, cardHeight }: Props) {
  const router = useRouter();

  // ✅ Use shared state from context
  const { isNotInterested, toggleNotInterested } = useNotInterested();

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
          />
        </View>
      )}
    />
  );
}
