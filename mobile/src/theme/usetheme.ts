//import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "./theme";
import { useThemePreference } from "./ThemePreferenceProvider";

export function useTheme(): Theme {
  //const scheme = useColorScheme();
  //return scheme === "dark" ? darkTheme : lightTheme;
  const {theme} = useThemePreference();
  return theme;
}
