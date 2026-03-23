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
  const lift = useRef(new Animated.Value(0)).current;
  const pressGlow = useRef(new Animated.Value(0)).current;

  const animatePress = (toValue: number) => {
    const pressed = toValue < 1;

    Animated.parallel([
      Animated.spring(scale, {
        toValue,
        useNativeDriver: false,
        friction: 6,
        tension: 210,
      }),
      Animated.timing(glow, {
        toValue: pressed ? 1 : 0,
        duration: pressed ? 120 : 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(lift, {
        toValue: pressed ? 1 : 0,
        duration: pressed ? 100 : 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(pressGlow, {
        toValue: pressed ? 1 : 0,
        duration: pressed ? 90 : 170,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shadowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  const translateY = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const borderGlow = pressGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(125, 245, 164, 0.0)', 'rgba(125, 245, 164, 0.55)'],
  });

  return (
    <Animated.View
      style={[
        styles.animationWrap,
        {
          transform: [{ scale }, { translateY }],
          shadowOpacity,
          borderColor: borderGlow,
        },
      ]}>
      <Pressable
        style={({ pressed }) => [
          styles.base,
          variantStyles[variant],
          (pressed || disabled || loading) && styles.dimmed,
        ]}
        onPress={onPress}
        onPressIn={() => animatePress(0.96)}
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
    borderWidth: 1,
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
