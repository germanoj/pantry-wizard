import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { WizardTitle, WizardBody } from "@/src/components/WizardText";

export interface SingleRecipeCardProps {
  title: string;
  time: string;
  image: any; // require(...) db image
  description?: string;
  ingredients?: string[];
  steps?: string[];

  isNotInterested?: boolean;

  onMakeNow?: () => void;
  onSaveForLater?: () => void;
  onToggleNotInterested?: () => void;

  showActions?: boolean;

  bottomActionLabel?: string;
  onBottomAction?: () => void;
}

export default function SingleRecipeCard({
  title,
  time,
  image,
  description,
  ingredients = [],
  steps = [],
  isNotInterested = false,
  onMakeNow,
  onSaveForLater,
  onToggleNotInterested,
  showActions = true,
  bottomActionLabel,
  onBottomAction,
}: SingleRecipeCardProps) {
  const theme = useTheme();

  // Only show footer if it has both label + handler
  const hasBottomAction = !!bottomActionLabel && !!onBottomAction;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isNotInterested && styles.notInterested,
          hasBottomAction && { paddingBottom: 120 }, // avoid overlapping footer
        ]}
        showsVerticalScrollIndicator={false}
      >
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholder,
              { borderColor: theme.border, backgroundColor: theme.surface2 },
            ]}
          >
            <WizardBody style={{ marginTop: 0 }}>No Image</WizardBody>
          </View>
        )}

        {/* Title + time */}
        <WizardTitle style={styles.title}>{title}</WizardTitle>
        <WizardBody style={[styles.time, { color: theme.textMuted }]}>
          {time}
        </WizardBody>

        {/* Action Buttons (hidden in cook mode) */}
        {showActions && (
          <View style={styles.actionsBar}>
            <Pressable
              onPress={onMakeNow}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.actionIcon}>🧙‍♂️</Text>
              <Text
                style={[
                  styles.actionLabel,
                  { color: theme.textMuted, fontFamily: "Nunito" },
                ]}
              >
                Make Now
              </Text>
            </Pressable>

            <Pressable
              onPress={onSaveForLater}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.actionIcon}>💾</Text>
              <Text
                style={[
                  styles.actionLabel,
                  { color: theme.textMuted, fontFamily: "Nunito" },
                ]}
              >
                Save for Later
              </Text>
            </Pressable>

            <Pressable
              onPress={onToggleNotInterested}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.actionIcon}>👎</Text>
              <Text
                style={[
                  styles.actionLabel,
                  { color: theme.textMuted, fontFamily: "Nunito" },
                ]}
              >
                {isNotInterested ? "Yuck" : "Dislike"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Description */}
        {description ? (
          <WizardBody style={styles.description}>{description}</WizardBody>
        ) : null}

        {/* Ingredients */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Ingredients
        </Text>
        {ingredients.map((item, index) => (
          <WizardBody key={index} style={styles.listItem}>
            • {item}
          </WizardBody>
        ))}

        {/* Steps */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Cooking Steps
        </Text>
        {steps.map((step, index) => (
          <WizardBody key={index} style={styles.listItem}>
            {index + 1}. {step}
          </WizardBody>
        ))}
      </ScrollView>

      {/* Bottom action (cook mode) */}
      {hasBottomAction && (
        <View
          style={[
            styles.bottomBar,
            { borderTopColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
          <Pressable
            onPress={onBottomAction}
            style={({ pressed }) => [
              styles.bottomBtn,
              { backgroundColor: theme.primary },
              pressed && styles.actionPressed,
            ]}
            hitSlop={8}
          >
            <Text style={[styles.bottomBtnText, { color: theme.primaryText }]}>
              {bottomActionLabel}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  content: {
    padding: ui.spacing.md,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: ui.radius.lg,
    marginBottom: ui.spacing.md,
  },

  placeholder: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginTop: 0, // WizardTitle default adds marginTop; detail screen doesn't need extra
  },

  time: {
    marginTop: 4,
  },

  description: {
    marginTop: ui.spacing.md,
  },

  sectionTitle: {
    marginTop: ui.spacing.lg,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "YuseiMagic",
  },

  listItem: {
    marginTop: 6,
  },

  actionsBar: {
    flexDirection: "row",
    gap: ui.spacing.sm,
    marginTop: ui.spacing.md,
    marginBottom: ui.spacing.sm,
  },

  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: ui.radius.md,
  },

  actionPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },

  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },

  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  notInterested: {
    opacity: 0.75,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: ui.spacing.md,
    paddingTop: ui.spacing.sm,
    paddingBottom: ui.spacing.sm,
    borderTopWidth: 1,
  },

  bottomBtn: {
    paddingVertical: 14,
    borderRadius: ui.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomBtnText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "NunitoSemiBold",
  },
});
