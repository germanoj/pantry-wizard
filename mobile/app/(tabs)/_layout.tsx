import { Tabs } from "expo-router";
import { useAuth } from "@/src/auth/AuthContext";

import { HapticTab } from "@/components/haptic-tab";
import Feather from "react-native-vector-icons/Feather";
import WizardHatIcon from "../wizardHat";

import { useTheme } from "@/src/theme/usetheme";

export default function TabLayout() {
  const { token } = useAuth(); // ✅ don't block UI on isLoading here
  const theme = useTheme();

  const isAuthed = !!token;

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarLabelPosition: "below-icon",
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,

          height: 72,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: theme.surface2,
          borderTopColor: theme.border,
          borderTopWidth: 1,

          borderRadius: 999,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
        headerStyle: { backgroundColor: theme.surface2 },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Pantry Wizard",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chatBot"
        options={{
          title: "Wizard",
          headerTitle: "Recipe Wizardry",
          tabBarIcon: ({ color }) => <WizardHatIcon size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          href: isAuthed ? undefined : null,
          title: "Saved Recipes",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="heart" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "My Page",
          headerTitle: "My Page",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="user" color={color} />
          ),
        }}
      />

      {/* hidden routes that still exist */}
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen
        name="loginReg"
        options={{
          href: null,
          title: "Login/Register",
          tabBarIcon: ({ color }) => (
            <Feather name="log-in" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
