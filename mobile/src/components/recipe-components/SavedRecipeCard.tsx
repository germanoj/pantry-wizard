import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

import { Card } from "@/src/components/Card";
import { WizardBody, WizardTitle } from "@/src/components/WizardText";
import { useTheme } from "@/src/theme/usetheme";

type Props = {
  title: string;
  timeMinutes?: number;
  imageUrl?: string;

  onPress?: () => void;
  onRemove?: () => void;
};

export default function SavedRecipeCard({
  title,
  timeMinutes,
  imageUrl,
  onPress,
  onRemove,
}: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
    >
      <Card variant="list">
        <View style={styles.row}>
          {!!imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.thumb}
              resizeMode="cover"
            />
          )}

          <View style={{ flex: 1 }}>
            <WizardTitle style={{ marginTop: 0 }}>{title}</WizardTitle>

            {!!timeMinutes && (
              <WizardBody style={{ marginTop: 6, opacity: 0.85 }}>
                {timeMinutes} min
              </WizardBody>
            )}
          </View>

          {!!onRemove && (
            <Pressable
              onPress={() => onRemove()}
              hitSlop={10}
              style={({ pressed }) => [
                styles.removePill,
                { borderColor: theme.danger, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <WizardBody style={{ marginTop: 0, color: theme.danger }}>
                Remove
              </WizardBody>
            </Pressable>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  removePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
});
