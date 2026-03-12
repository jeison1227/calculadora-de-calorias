import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

import { AppColorScheme, colorSchemes, getTypography } from '@/constants/design-system';

const THEME_PREFERENCE_KEY = 'themePreference';

type ThemePreference = AppColorScheme | 'system';

type AppThemeContextValue = {
  colorScheme: AppColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
  colors: (typeof colorSchemes)[AppColorScheme];
  typography: ReturnType<typeof getTypography>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

const normalizeSystemScheme = (scheme: ColorSchemeName): AppColorScheme => (scheme === 'dark' ? 'dark' : 'light');

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setStoredPreference] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then(value => {
        if (value === 'light' || value === 'dark' || value === 'system') {
          setStoredPreference(value);
        }
      })
      .catch(() => undefined);
  }, []);

  const colorScheme = preference === 'system' ? normalizeSystemScheme(systemScheme) : preference;
  const colors = colorSchemes[colorScheme];
  const typography = useMemo(() => getTypography(colors), [colors]);

  const setPreference = async (nextPreference: ThemePreference) => {
    setStoredPreference(nextPreference);
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, nextPreference);
  };

  const toggleTheme = async () => {
    const nextTheme: AppColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    await setPreference(nextTheme);
  };

  return (
    <AppThemeContext.Provider value={{ colorScheme, preference, setPreference, toggleTheme, colors, typography }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}
