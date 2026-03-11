import { Platform } from 'react-native';

export const palette = {
  background: '#F3F6FB',
  surface: '#FFFFFF',
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  secondary: '#0891B2',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  success: '#16A34A',
  warning: '#D97706',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const typography = {
  title: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: palette.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: palette.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: palette.textSecondary,
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
