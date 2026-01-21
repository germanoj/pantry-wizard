import { Stack } from "expo-router";
import { useTheme } from "@/src/theme/usetheme";

export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack 
      screenOptions={{ 
        headerStyle: { backgroundColor: theme.surface2 },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text, // back button / icons
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  );
}
