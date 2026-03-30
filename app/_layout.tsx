import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { palette } from '@/constants/design-system';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const appLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.surface,
    text: palette.textPrimary,
    border: palette.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : appLightTheme}>
      <Stack
        screenOptions={{
          animation: 'fade_from_bottom',
          animationDuration: 320,
          contentStyle: { backgroundColor: palette.background },
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="camera" options={{ animation: 'slide_from_right', animationDuration: 260 }} />
        <Stack.Screen name="recetas" options={{ animation: 'slide_from_right', animationDuration: 260 }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', animation: 'slide_from_bottom', animationDuration: 320, title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
