import React from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";

export interface RecipeCardProps {
  title: string;
  time: string;
  image: any; //require(...) db image
  onPress?: () => void;
}

export default function RecipeCard({
  title,
  time,
  image,
  onPress,
}: RecipeCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/*Image */}
      {/* Image */}
      {image ? (
        <Image style={styles.image} source={image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ fontSize: 10, color: "#999" }}>No Image</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Text style={styles.action}>🧙‍♂️</Text>
        <Text style={styles.action}>💾</Text>
        <Text style={styles.action}>👎</Text>
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
    borderRadius: 12,
    padding: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
  },
  actions: {
    alignItems: "center",
    gap: 10,
  },
  action: {
    fontSize: 18,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
});
