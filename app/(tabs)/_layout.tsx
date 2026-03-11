import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { palette, spacing } from '@/constants/design-system';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarActiveBackgroundColor: palette.surface,
        tabBarStyle: {
          height: 68,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          backgroundColor: palette.background,
          borderTopColor: palette.border,
        },
        headerShown: false,
        tabBarButton: HapticTab,
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
