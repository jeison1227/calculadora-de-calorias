import { Platform } from 'react-native';

export const colorSchemes = {
  light: {
    primary: '#15803D',
    primaryDark: '#166534',
    secondary: '#0369A1',
    accent: '#C2410C',
    background: '#F5F7FB',
    backgroundSoft: '#EAF0FA',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    border: '#CBD5E1',
    success: '#059669',
  },
  dark: {
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
} as const;

export type AppColorScheme = keyof typeof colorSchemes;
export type AppColors = (typeof colorSchemes)[AppColorScheme];

export const spacing = {
  xs: 6,
  sm: 10,
  md: 18,
  lg: 28,
  xl: 36,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
};

const baseTypography = {
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
};

export const getTypography = (colors: AppColors) => ({
  title: {
    ...baseTypography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...baseTypography.subtitle,
    color: colors.textPrimary,
  },
  body: {
    ...baseTypography.body,
    color: colors.textSecondary,
  },
  caption: {
    ...baseTypography.caption,
    color: colors.textSecondary,
  },
});


export const palette = colorSchemes.dark;
export const typography = getTypography(colorSchemes.dark);

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
