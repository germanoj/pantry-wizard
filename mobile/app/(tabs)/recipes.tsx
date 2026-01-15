import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import RecipeResults from "../recipe-components/RecipeResults";
import { MOCK_RECIPES } from "@/data/recipes";

const FOOTER_HEIGHT = 72;

export default function RecipesTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cardHeight = useMemo(() => {
    const screenH = Dimensions.get("window").height;
    const usable = screenH - insets.top - insets.bottom - FOOTER_HEIGHT;
    return Math.max(180, Math.floor(usable * 0.26));
  }, [insets.top, insets.bottom]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.listArea}>
          <RecipeResults recipes={MOCK_RECIPES} cardHeight={cardHeight} />
        </View>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(12, insets.bottom) },
          ]}
        >
          <Pressable
            onPress={() => router.navigate("/(tabs)/chatBot")}
            style={styles.wizardButton}
          >
            <Text style={styles.wizardButtonText}>
              Don’t like these recipes? Go back to Wizard
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  listArea: { flex: 1 },
  footer: {
    height: FOOTER_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  wizardButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  wizardButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
