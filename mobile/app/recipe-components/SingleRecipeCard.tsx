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
  onBack?: () => void;
}

export default function SingleRecipeCard({
  title,
  time,
  image,
  description,
  ingredients = [],
  steps = [],
  onBack,
}: SingleRecipeCardProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/*Header with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      </View>
      {/*Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={image} style={styles.image} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
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
  header: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
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
});
