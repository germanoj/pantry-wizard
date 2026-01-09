import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/usetheme";

export function WizardTitle(props: TextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[
        styles.title,
        { color: theme.text, 
        fontFamily: "YuseiMagic"},
        props.style,
      ]}
    />
  );
}

export function WizardBody(props: TextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[styles.body, { color: theme.textMuted, fontFamily: "Nunito"}, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
});
