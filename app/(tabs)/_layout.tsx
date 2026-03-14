import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { palette, spacing } from '@/constants/design-system';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarButton: HapticTab,
        transitionSpec: {
          animation: 'timing',
          config: { duration: 220 },
        },
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
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={22} name="home-variant-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={22} name="qrcode-scan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={22} name="silverware-fork-knife" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={22} name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={22} name="account-circle-outline" color={color} />,
        }}
      />

      <Tabs.Screen name="manual" options={{ href: null }} />
      <Tabs.Screen name="ai" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
