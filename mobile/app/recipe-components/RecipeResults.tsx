import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import RecipeCard from "./RecipeCard";

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
}

export default function RecipeResults({ recipes }: Props) {
  const router = useRouter();

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      style={{ flex: 1 }}
      renderItem={({ item }) => (
        <RecipeCard
          title={item.title}
          time={item.time}
          image={item.image}
          onPress={() =>
            router.push({
              pathname: "/recipe/[id]",
              params: { id: item.id },
            })
          }
        />
      )}
    />
  );
}
