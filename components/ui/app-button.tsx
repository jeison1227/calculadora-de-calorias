import { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';

import { palette, radius, spacing } from '@/constants/design-system';

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
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 6,
      tension: 210,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.base,
          variantStyles[variant],
          (pressed || disabled || loading) && styles.dimmed,
        ]}
        onPress={onPress}
        onPressIn={() => animatePress(0.97)}
        onPressOut={() => animatePress(1)}
        disabled={disabled || loading}>
        {loading ? (
          <ActivityIndicator color={variant === 'ghost' ? palette.primary : '#FFFFFF'} />
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

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  ghost: {
    backgroundColor: '#152646',
    borderWidth: 1,
    borderColor: palette.border,
  },
});

const variantTextStyles = StyleSheet.create({
  primary: {
    color: '#001B0B',
  },
  secondary: {
    color: '#FFFFFF',
  },
  ghost: {
    color: palette.textPrimary,
  },
});
