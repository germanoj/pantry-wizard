import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";

export function Card({
  centered = false,
  style,
  ...props
}: ViewProps & { centered?: boolean }) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
          centered && styles.centered,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 420,
    padding: ui.spacing.lg,
    borderRadius: ui.radius.lg,
    borderWidth: 1,

    //alignment within the card
    //alignItems: "center",     // ⬅️ horizontal
    //justifyContent: "center", // ⬅️ vertical (optional)

    // this creates that lift impresssion
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 3, // android!!
  },
   centered: {
    alignItems: "center",
   }
});