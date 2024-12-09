import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    headerShown: false, // Ensure this is set globally
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
      },
      default: {},
    }),
  }}
>

<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    headerShown: false, // Explicitly disable for this screen
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
  }}
/>
<Tabs.Screen
  name="explore"
  options={{
    title: 'Explore',
    headerShown: false, // Explicitly disable for this screen
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
  }}
/>

    </Tabs>
  );
}