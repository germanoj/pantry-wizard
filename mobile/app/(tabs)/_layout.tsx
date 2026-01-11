import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import Feather from "react-native-vector-icons/Feather";
import WizardHatIcon from "../wizardHat";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        //headerShown: false,
        tabBarButton: HapticTab,
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
        name="recipes"
        options={{
          title: "Recipes",
          headerTitle: "Recipes",
          tabBarIcon: ({ color }) => (
            <Feather name="book-open" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
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

      
      {/* cant see the tab but page still exists*/}
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
