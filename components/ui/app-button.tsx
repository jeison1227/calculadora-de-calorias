import { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';

import { radius, spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 6,
      tension: 210,
    }).start();
  };

  const variantStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.secondary },
    ghost: { backgroundColor: colors.backgroundSoft, borderWidth: 1, borderColor: colors.border },
  } as const;

  const variantTextStyles = {
    primary: { color: colors.background },
    secondary: { color: '#FFFFFF' },
    ghost: { color: colors.textPrimary },
  } as const;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={({ pressed }) => [styles.base, variantStyles[variant], (pressed || disabled || loading) && styles.dimmed]}
        onPress={onPress}
        onPressIn={() => animatePress(0.97)}
        onPressOut={() => animatePress(1)}
        disabled={disabled || loading}>
        {loading ? (
          <ActivityIndicator color={variant === 'ghost' ? colors.primary : '#FFFFFF'} />
        ) : (
          <Text style={[styles.text, variantTextStyles[variant]]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dimmed: {
    opacity: 0.75,
  },
});
