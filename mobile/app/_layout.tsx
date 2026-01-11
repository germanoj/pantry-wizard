import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { NotInterestedProvider } from "../state/NotInterestedContext";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
    NunitoSemiBold: require("../assets/fonts/Nunito-SemiBold.ttf"),
    PrincessSofia: require("../assets/fonts/PrincessSofia-Regular.ttf"),
    YuseiMagic: require("../assets/fonts/YuseiMagic-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <NotInterestedProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/*<Stack.Screen name="generate" options={{ title: "Recipe Wizardry" }} /> */}          
        {/*<Stack.Screen name="(auth)/login" options={{ title: "Login" }}/> */}
        {/* <Stack.Screen name="(auth)/register" options={{ title: "Register" }} /> */}
          <Stack.Screen name="recipe" options={{ headerShown: false }} />
        {/* added recipe stack screen to layout!*/}

          <Stack.Screen
            name="(modals)/register-modal"
            options={{ presentation: "modal", title: "Create Account", headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NotInterestedProvider>
  );
}
