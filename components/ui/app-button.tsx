import { useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';

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
  const glow = useRef(new Animated.Value(0)).current;

  const animatePress = (toValue: number) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        friction: 6,
        tension: 210,
      }),
      Animated.timing(glow, {
        toValue: toValue < 1 ? 1 : 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shadowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.28],
  });

  return (
    <Animated.View
      style={[
        styles.animationWrap,
        {
          transform: [{ scale }],
          shadowOpacity,
        },
      ]}>
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
  animationWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
    borderRadius: radius.md,
  },
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
