import { ReactNode, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type AnimatedRevealProps = {
  children: ReactNode;
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  initialScale?: number;
};

export function AnimatedReveal({
  children,
  visible,
  style,
  duration = 260,
  initialScale = 0.95,
}: AnimatedRevealProps) {
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [duration, progress, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: initialScale + (1 - initialScale) * progress.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
