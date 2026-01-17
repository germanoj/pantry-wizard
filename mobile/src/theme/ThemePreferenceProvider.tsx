import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkTheme, lightTheme, Theme } from "./theme";

export type ThemePreference = "system" | "light" | "dark";

type ThemePrefContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggleDarkMode: () => void; //simple switch
  theme: Theme;
  isHydrated: boolean;
};

const ThemePrefContext = createContext<ThemePrefContextValue | null>(null);

const STORAGE_KEY = "theme_preference";

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "system" || saved === "light" || saved === "dark") {
          setPreferenceState(saved);
        }
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const setPreference = async (p: ThemePreference) => {
    setPreferenceState(p);
    await AsyncStorage.setItem(STORAGE_KEY, p);
  };

  const effectiveMode: "light" | "dark" =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const theme = effectiveMode === "dark" ? darkTheme : lightTheme;

  const toggleDarkMode = useCallback(() => {
    void setPreference(effectiveMode === "dark" ? "light" : "dark");
    }, [effectiveMode]);

  const value = useMemo(
    () => ({ preference, setPreference, toggleDarkMode, theme, isHydrated }),
    [preference, toggleDarkMode, theme, isHydrated]
  );

  return <ThemePrefContext.Provider value={value}>{children}</ThemePrefContext.Provider>;
}

export function useThemePreference() {
  const ctx = useContext(ThemePrefContext);
  if (!ctx) throw new Error("useThemePreference must be used inside ThemePreferenceProvider");
  return ctx;
}
