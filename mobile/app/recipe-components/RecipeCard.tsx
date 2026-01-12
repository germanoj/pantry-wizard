import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";

import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";
import { Card } from "@/src/components/Card";
import { WizardTitle, WizardBody } from "@/src/components/WizardText";

export interface RecipeCardProps {
  title: string;
  time: string;
  image: any; // require(...) or { uri: ... }
  onPress?: () => void;
  style?: ViewStyle;

  /** Not Interested */
  isNotInterested?: boolean;
  onToggleNotInterested?: () => void;

  /** Actions */
  onMakeNow?: () => void;
  onSaveForLater?: () => void;
}

export default function RecipeCard({
  title,
  time,
  image,
  onPress,
  style,
  isNotInterested = false,
  onToggleNotInterested,
  onMakeNow,
  onSaveForLater,
}: RecipeCardProps) {
  const theme = useTheme();

  const stop = (e: GestureResponderEvent) => e.stopPropagation?.();

  const handleMakeNow = (e: GestureResponderEvent) => {
    stop(e);
    onMakeNow?.();
  };

  const handleSave = (e: GestureResponderEvent) => {
    stop(e);
    onSaveForLater?.();
  };

  const handleToggleNotInterested = (e: GestureResponderEvent) => {
    stop(e);
    onToggleNotInterested?.();
  };

  return (
    <Pressable
      onPress={onPress}
      style={[style, isNotInterested && styles.notInterested]}
      accessibilityRole="button"
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {/* Left: Image */}
        {image ? (
          <Image style={styles.image} source={image} />
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

        {/* Right: Title/Time + Actions row */}
        <View style={styles.right}>
          <View style={styles.content}>
            <WizardTitle style={styles.title} numberOfLines={2}>
              {title}
            </WizardTitle>

            <WizardBody
              style={[styles.time, { color: theme.textMuted }]}
              numberOfLines={1}
            >
              {time}
            </WizardBody>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleMakeNow}
              disabled={!onMakeNow}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
                !onMakeNow && styles.disabledBtn,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Make now"
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
              onPress={handleSave}
              disabled={!onSaveForLater}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
                !onSaveForLater && styles.disabledBtn,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Save for later"
            >
              <Text style={styles.actionIcon}>💾</Text>
              <Text
                style={[
                  styles.actionLabel,
                  { color: theme.textMuted, fontFamily: "Nunito" },
                ]}
              >
                Save
              </Text>
            </Pressable>

            <Pressable
              onPress={handleToggleNotInterested}
              disabled={!onToggleNotInterested}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surface2, borderColor: theme.border },
                pressed && styles.actionPressed,
                !onToggleNotInterested && styles.disabledBtn,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isNotInterested ? "Yuck" : "Dislike"}
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
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Compact list card override for shared Card component.
  card: {
    maxWidth: undefined,
    width: "100%",
    flex: 1,

    // ✅ critical: keep image + content side-by-side
    flexDirection: "row",
    alignItems: "center",

    padding: ui.spacing.md,
    borderRadius: ui.radius.lg,
  },

  image: {
    width: 84,
    height: 84,
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
    justifyContent: "space-between",
  },

  content: {
    flexShrink: 1,
  },

  title: {
    fontSize: 18,
    marginTop: 0,
  },

  time: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
  },

  actionsRow: {
    marginTop: ui.spacing.sm,
    flexDirection: "row",
    gap: ui.spacing.sm,
  },

  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: ui.radius.md,
    borderWidth: 1,
  },

  actionPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },

  disabledBtn: {
    opacity: 0.45,
  },

  actionIcon: {
    fontSize: 18,
    marginBottom: 4,
  },

  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  notInterested: {
    opacity: 0.75,
  },
});
