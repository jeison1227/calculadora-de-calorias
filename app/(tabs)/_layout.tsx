import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#64748B',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { height: 68, paddingBottom: 8, paddingTop: 8 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: 'Manual',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="list.bullet.clipboard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Cámara',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="camera.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="chart.line.uptrend.xyaxis" color={color} />,
        }}
      />
    </Tabs>
  );
}
