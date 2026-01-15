import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { Card } from "@/src/components/Card";
import { WizardTitle, WizardBody } from "@/src/components/WizardText";
import type { GeneratedRecipe } from "@/src/state/GeneratedRecipesContext";

type Props = {
  recipe: GeneratedRecipe;
  onPress: () => void;
};

export function GeneratedRecipeCard({ recipe, onPress }: Props) {
  const theme = useTheme();

  const img = recipe.imageUrl ? { uri: recipe.imageUrl } : null;

  // Show "ingredientsUsed" only; keep it short to avoid scrolling.
  const preview = recipe.ingredientsUsed.slice(0, 5).join(", ");
  const extraCount = Math.max(0, recipe.ingredientsUsed.length - 5);

  // Keep time compact
  const timeLabel = recipe.timeMinutes ? `${recipe.timeMinutes} min` : "";

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {img ? (
          <Image style={styles.image} source={img} />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholder,
              { borderColor: theme.border, backgroundColor: theme.surface2 },
            ]}
          >
            <Text
              style={{
                color: theme.textMuted,
                fontFamily: "Nunito",
                fontSize: 11,
              }}
            >
              No Image
            </Text>
          </View>
        )}

        <View style={styles.right}>
          <WizardTitle style={styles.title} numberOfLines={1}>
            {recipe.title}
          </WizardTitle>

          {!!timeLabel && (
            <WizardBody
              style={[styles.meta, { color: theme.textMuted }]}
              numberOfLines={1}
            >
              {timeLabel}
            </WizardBody>
          )}

          <WizardBody
            style={[styles.meta, { color: theme.textMuted }]}
            numberOfLines={2}
          >
            {preview}
            {extraCount > 0 ? ` +${extraCount} more` : ""}
          </WizardBody>

          {/* Optional: Missing ingredients preview (still "not steps") */}
          {!!recipe.missingIngredients?.length && (
            <WizardBody
              style={[styles.missing, { color: theme.textMuted }]}
              numberOfLines={1}
            >
              Missing: {recipe.missingIngredients.slice(0, 3).join(", ")}
              {recipe.missingIngredients.length > 3 ? "…" : ""}
            </WizardBody>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: ui.spacing.md,
    borderRadius: ui.radius.lg,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: ui.radius.md,
    marginRight: ui.spacing.md,
  },
  placeholder: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    marginTop: 0,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
  },
  missing: {
    fontSize: 11,
    lineHeight: 14,
  },
});
