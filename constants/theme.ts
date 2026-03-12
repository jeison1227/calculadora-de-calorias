import { Platform } from 'react-native';

import { colorSchemes } from '@/constants/design-system';

export const Colors = {
  light: {
    text: colorSchemes.light.textPrimary,
    background: colorSchemes.light.background,
    tint: colorSchemes.light.primary,
    icon: '#475569',
    tabIconDefault: '#64748B',
    tabIconSelected: colorSchemes.light.primary,
  },
  dark: {
    text: colorSchemes.dark.textPrimary,
    background: colorSchemes.dark.background,
    tint: colorSchemes.dark.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
