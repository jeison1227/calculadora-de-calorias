import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { palette, spacing } from '@/constants/design-system';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: '#6F83AE',
        tabBarStyle: {
          position: 'absolute',
          height: 76,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          marginHorizontal: spacing.md,
          marginBottom: spacing.sm,
          backgroundColor: palette.surface,
          borderTopWidth: 1,
          borderColor: palette.border,
          borderRadius: 22,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: 'Manual',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="square.and.pencil" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="camera.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
