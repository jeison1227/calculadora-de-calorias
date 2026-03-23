import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FadeInViewProps = {
  children: ReactNode;
  duration?: number;
  style?: ViewStyle;
  distance?: number;
  initialScale?: number;
};

export function FadeInView({
  children,
  duration = 350,
  style,
  distance = 14,
  initialScale = 0.99,
}: FadeInViewProps) {
  const isFocused = useIsFocused();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = isFocused
      ? withTiming(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      : 0;
  }, [duration, isFocused, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: distance * (1 - progress.value) },
      { scale: initialScale + (1 - initialScale) * progress.value },
    ],
  }));

  return <Animated.View style={[styles.wrapper, style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
