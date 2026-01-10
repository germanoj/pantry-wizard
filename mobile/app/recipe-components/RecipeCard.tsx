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
  image: any; // require(...) or { uri: ... }
  onPress?: () => void;

  onSave?: () => void;
  onDismiss?: () => void;
  onMagic?: () => void;
}

function stop(e: any) {
  e?.stopPropagation?.();
  e?.preventDefault?.();
}

export default function RecipeCard({
  title,
  time,
  image,
  onPress,
  style,
  isNotInterested = false,
  onToggleNotInterested,
  onSave,
  onDismiss,
  onMagic,
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

        {/* Actions */}
        <View style={styles.actions} pointerEvents="box-none">
          <Pressable
            onPress={(e) => {
              stop(e);
              onMagic?.();
            }}
            disabled={!onMagic}
            hitSlop={10}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.pressed,
              !onMagic && styles.disabledBtn,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Magic"
          >
            <Text style={styles.action}>🧙‍♂️</Text>
          </Pressable>

          <Pressable
            onPress={(e) => {
              stop(e);
              onSave?.();
            }}
            disabled={!onSave}
            hitSlop={10}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.pressed,
              !onSave && styles.disabledBtn,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Save recipe"
          >
            <Text style={styles.action}>💾</Text>
          </Pressable>

          <Pressable
            onPress={(e) => {
              stop(e);
              onToggleNotInterested?.(); // keep your shared context behavior
              onDismiss?.(); // optional extra hook
            }}
            hitSlop={10}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isNotInterested ? "Yuck" : "Dislike"}
          >
            <Text style={styles.action}>👎</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
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
  content: {
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
    padding: 4,
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  action: {
    fontSize: 18,
  },
});
