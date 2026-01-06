import { Tabs } from 'expo-router';
import React from 'react';

import {Stack} from "expo-router"

import { HapticTab } from '@/components/haptic-tab';
//import { IconSymbol } from '@/components/ui/icon-symbol';
import Feather from 'react-native-vector-icons/Feather';
import WizardHatIcon from '../wizardHat';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (<Feather name="home" size={24} color={color} />),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login/Register',
          tabBarIcon: ({ color, size }) => <Feather name="log-in" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatBot"
        options={{
          title: 'Wizard',
          tabBarIcon: ({color, size}) => (<WizardHatIcon size={24} color={color}/>
          ),
        }}
      />
      
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved Recipes',
          tabBarIcon: ({ color }) => <Feather size={24} name="heart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Page',
          tabBarIcon: ({ color }) => <Feather size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
