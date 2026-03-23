import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { palette, radius, spacing } from '@/constants/design-system';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const pressed = useSharedValue(0);

  const handlePressIn = () => {
    pressed.value = withTiming(1, {
      duration: 90,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, {
      damping: 12,
      stiffness: 240,
      mass: 0.8,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.95]) },
      { translateY: interpolate(pressed.value, [0, 1], [0, 1]) },
    ],
    shadowOpacity: interpolate(pressed.value, [0, 1], [0.14, 0.26]),
    borderColor: interpolateColor(
      pressed.value,
      [0, 1],
      ['rgba(125, 245, 164, 0.10)', 'rgba(125, 245, 164, 0.38)']
    ),
  }));

  return (
    <Animated.View style={[styles.animationWrap, animatedStyle, style]}>
      <Pressable
        style={({ pressed: isPressed }) => [
          styles.base,
          variantStyles[variant],
          (isPressed || disabled || loading) && styles.dimmed,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    shadowRadius: 12,
    elevation: 5,
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
    opacity: 0.82,
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
