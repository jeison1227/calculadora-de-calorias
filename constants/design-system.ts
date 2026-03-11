import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#4F46E5',
    secondary: '#0891B2',
    background: '#F3F6FB',
    primaryDark: '#4338CA',
    accent: '#F59E0B',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    success: '#16A34A',
  },
  typography: {
    title: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
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
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  android: {
    elevation: 4,
  },
  default: {},
});
