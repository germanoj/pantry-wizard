import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/usetheme";
import { WizardTitle, WizardBody } from "@/src/components/WizardText";
import { useGeneratedRecipes } from "../../src/state/GeneratedRecipesContext";
import { saveUiRecipe } from "@/src/lib/saveRecipeAction";

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { getById } = useGeneratedRecipes();

  // Optional debug (remove later)
  // console.log("RecipeDetails id:", id);

  const recipe = getById(String(id));

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <WizardTitle>Recipe not found</WizardTitle>
        <WizardBody style={{ color: theme.textMuted }}>
          Generate recipes again and tap one.
        </WizardBody>
      </View>
    );
  }

  const img = recipe.imageUrl ? { uri: recipe.imageUrl } : null;

  const ingredientsUsed = Array.isArray(recipe.ingredientsUsed)
    ? recipe.ingredientsUsed
    : [];
  const missingIngredients = Array.isArray(recipe.missingIngredients)
    ? recipe.missingIngredients
    : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 140 + insets.bottom },
        ]}
      >
        <WizardTitle>{recipe.title}</WizardTitle>

        {!!img && <Image source={img} style={styles.hero} />}

        <WizardBody style={{ color: theme.textMuted }}>
          {recipe.timeMinutes} min
        </WizardBody>

        <WizardTitle style={styles.sectionTitle}>Ingredients</WizardTitle>

        {ingredientsUsed.map((x, i) => (
          <WizardBody key={`used-${i}`} style={styles.bullet}>
            • {x}
          </WizardBody>
        ))}

        {missingIngredients.length > 0 && (
          <>
            <WizardTitle style={styles.sectionTitle}>Missing</WizardTitle>
            {missingIngredients.map((x, i) => (
              <WizardBody key={`miss-${i}`} style={styles.bullet}>
                • {x}
              </WizardBody>
            ))}
          </>
        )}

        <WizardTitle style={styles.sectionTitle}>Steps</WizardTitle>

        {steps.map((x, i) => (
          <WizardBody key={`step-${i}`} style={styles.step}>
            {i + 1}. {x}
          </WizardBody>
        ))}
      </ScrollView>

      {/* Bottom Save Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border ?? "rgba(0,0,0,0.1)",
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <Pressable
          onPress={() =>
            saveUiRecipe({
              title: recipe.title,
              time: `${recipe.timeMinutes} min`,
              ingredients: ingredientsUsed,
              steps,
            })
          }
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.9 },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Save recipe"
        >
          <Text style={[styles.saveBtnText, { color: theme.primaryText }]}>
            Save Recipe
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
  },
  hero: {
    width: "100%",
    height: 220,
    borderRadius: 14,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 18,
  },
  step: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 9999,
    elevation: 9999,
  },
  saveBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
