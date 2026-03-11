import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#22C55E',
    primaryDark: '#16A34A',
    secondary: '#0EA5E9',
    accent: '#F97316',
    background: '#081022',
    backgroundSoft: '#111C35',
    surface: '#111B2F',
    surfaceElevated: '#182745',
    textPrimary: '#F8FAFC',
    textSecondary: '#A8B6D6',
    border: '#243A64',
    success: '#34D399',
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 38,
      letterSpacing: 0.2,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 30,
      letterSpacing: 0.15,
    },
    body: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.25,
    },
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 28,
    xl: 36,
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 26,
    pill: 999,
  },
};

export const palette = theme.colors;
export const spacing = theme.spacing;
export const radius = theme.radius;

export const typography = {
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
};

export const shadows = Platform.select({
  ios: {
    shadowColor: '#020617',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: {
    elevation: 8,
  },
  default: {},
});
