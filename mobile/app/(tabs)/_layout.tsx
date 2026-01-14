import { Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "@/src/auth/AuthContext";
import { useTheme } from "@/src/theme/usetheme";

import { HapticTab } from "@/components/haptic-tab";
import Feather from "react-native-vector-icons/Feather";
import WizardHatIcon from "../wizardHat";

export default function TabLayout() {
  const { token, isLoading } = useAuth();
  const theme = useTheme();
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

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
          borderRadius: 999, // pill style
          // iOS shadow

          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          // Android shadow

          elevation: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
        //header colors
        headerStyle: { backgroundColor: theme.surface2 },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text, // back button / icons
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
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "My Page",
          headerTitle: "My Page",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />

      {/* hidden routes */}
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen name="saved/(details)/[id]" options={{ href: null }} />
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
