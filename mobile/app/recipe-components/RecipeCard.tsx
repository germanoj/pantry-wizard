const UI = {
  borderWidth: 2,
  borderRadius: 14,
  padding: 14,

  imageSize: 76,
  imageRadius: 14,

  titleFont: 16,
  timeFont: 12,

  actionSize: 24,
  actionGap: 8,
};

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

export interface RecipeCardProps {
  title: string;
  time: string;
  image: any; // require(...) db image
  onPress?: () => void;
  style?: ViewStyle;

  /** Not Interested */
  isNotInterested?: boolean;
  onToggleNotInterested?: () => void;

  /** Optional: wire later */
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
      style={[styles.card, style, isNotInterested && styles.notInterested]}
      accessibilityRole="button"
    >
      {/* Left: Image */}
      {image ? (
        <Image style={styles.image} source={image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {/* Right: Title/Time + Actions row */}
      <View style={styles.right}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleMakeNow}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <Text style={styles.actionIcon}>🧙‍♂️</Text>
            <Text style={styles.actionLabel}>Make Now</Text>
          </Pressable>

          <Pressable onPress={handleSave} style={styles.actionBtn} hitSlop={8}>
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionLabel}>Save for Later</Text>
          </Pressable>

          <Pressable
            onPress={handleToggleNotInterested}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <Text style={styles.actionIcon}>👎</Text>
            <Text style={styles.actionLabel}>
              {isNotInterested ? "Yuck" : "Dislike"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: UI.borderWidth,
    borderColor: "#eee",
    borderRadius: UI.borderRadius,
    padding: UI.padding,
  },

  image: {
    width: UI.imageSize,
    height: UI.imageSize,
    borderRadius: UI.imageRadius,
    marginRight: 14,
  },

  right: {
    flex: 1,
    justifyContent: "space-between",
  },

  content: {
    flexShrink: 1,
  },

  title: {
    fontSize: UI.titleFont,
    fontWeight: "600",
  },

  time: {
    marginTop: 6,
    fontSize: UI.timeFont,
    color: "#666",
  },

  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  actionIcon: {
    fontSize: UI.actionSize,
    marginBottom: 4,
  },

  actionLabel: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
  },

  placeholder: {
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },

  placeholderText: {
    fontSize: 10,
    color: "#999",
  },

  notInterested: {
    opacity: 0.75,
  },
});
