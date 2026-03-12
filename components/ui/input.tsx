import { ComponentProps } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { radius, spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

type AppInputProps = ComponentProps<typeof TextInput>;

export function AppInput(props: AppInputProps) {
  const { colors } = useAppTheme();

  return <TextInput placeholderTextColor={colors.textSecondary} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundSoft, color: colors.textPrimary }]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
    fontSize: 15,
    lineHeight: 22,
  },
});
