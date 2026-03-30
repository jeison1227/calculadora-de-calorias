import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, spacing } from '@/constants/design-system';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, loading = false, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, (pressed || loading || disabled) && styles.buttonDimmed]}
      onPress={onPress}
      disabled={loading || disabled}>
      {loading ? <ActivityIndicator color="#001B0B" /> : <Text style={styles.title}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 5,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDimmed: {
    opacity: 0.8,
  },
  title: {
    color: '#001B0B',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
