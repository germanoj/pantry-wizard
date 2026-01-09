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

export interface SingleRecipeCardProps {
  title: string;
  time: string;
  image: any; //require(...) db image
  description?: string;
  ingredients?: string[];
  steps?: string[];
  isNotInterested?: boolean;
  onMakeNow?: () => void;
  onSaveForLater?: () => void;
  onToggleNotInterested?: () => void;
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
}: SingleRecipeCardProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/*Scrollable Content */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isNotInterested && styles.notInterested,
        ]}
      >
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={{ color: "#999" }}>No Image</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>

        {/* Action Buttons */}
        <View style={styles.actionsBar}>
          <Pressable onPress={onMakeNow} style={styles.actionBtn} hitSlop={8}>
            <Text style={styles.actionIcon}>🧙‍♂️</Text>
            <Text style={styles.actionLabel}>Make Now</Text>
          </Pressable>

          <Pressable
            onPress={onSaveForLater}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionLabel}>Save for Later</Text>
          </Pressable>

          <Pressable
            onPress={onToggleNotInterested}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <Text style={styles.actionIcon}>👎</Text>
            <Text style={styles.actionLabel}>
              {isNotInterested ? "Yuck" : "Dislike"}
            </Text>
          </Pressable>
        </View>

        {/*Description */}
        <Text style={styles.description}>{description}</Text>

        {/*Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item}
          </Text>
        ))}
        {/*Steps */}
        <Text style={styles.sectionTitle}>Cooking Steps</Text>
        {steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  time: {
    marginTop: 4,
    color: "#555",
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  listItem: {
    marginTop: 6,
    fontSize: 14,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },

  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  actionLabel: {
    fontSize: 11,
    color: "#444",
    fontWeight: "600",
    textAlign: "center",
  },
  notInterested: {
    opacity: 0.75,
  },
});
