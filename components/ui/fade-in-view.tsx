import { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type FadeInViewProps = {
  children: ReactNode;
  duration?: number;
  style?: ViewStyle;
};

export function FadeInView({ children, duration = 350, style }: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [duration, opacity]);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}
