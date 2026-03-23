import { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/design-system';

type InputFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
};

export function InputField({ label, error, style, ...props }: InputFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#6F83AE"
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    ...typography.caption,
    color: palette.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
    backgroundColor: palette.backgroundSoft,
    color: palette.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  inputError: {
    borderColor: '#F87171',
  },
  error: {
    ...typography.caption,
    color: '#FCA5A5',
  },
});
