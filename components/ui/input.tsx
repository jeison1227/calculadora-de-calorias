import { ComponentProps } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { palette, radius, spacing } from '@/constants/design-system';

type AppInputProps = ComponentProps<typeof TextInput>;

export function AppInput(props: AppInputProps) {
  return (
    <TextInput
      placeholderTextColor="#94A3B8"
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: '#F8FAFC',
    color: palette.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
});
