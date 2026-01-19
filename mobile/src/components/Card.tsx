import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "@/src/theme/usetheme";
import { ui } from "@/src/theme/theme";

export function Card({
  centered = false,
  variant = "default",
  style,
  ...props
}: ViewProps & {
  centered?: boolean;
  variant?: "default" | "overlay" | "list";
}) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        variant === "list" && styles.listCard,
        centered && styles.centered,
        variant === "overlay" && styles.overlayCard,
        {
          backgroundColor:
            variant === "overlay" ? "rgba(255,255,255,0.20)" : theme.surface,
          borderColor:
            variant === "overlay" ? "rgba(255,255,255,0.22)" : theme.border,
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

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  // ✅ new: list-friendly card (for Recipe results, Saved list, etc.)
  listCard: {
    maxWidth: undefined, // take full available width in lists
    padding: ui.spacing.md, // tighter padding
  },

  overlayCard: {
    maxWidth: 320,
    shadowOpacity: 0,
    elevation: 0,
  },

  centered: {
    alignItems: "center",
  },
});
