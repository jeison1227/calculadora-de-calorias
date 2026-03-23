import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

type FadeInViewProps = {
  children: ReactNode;
  duration?: number;
  style?: ViewStyle;
};

export function FadeInView({ children, duration = 350, style }: FadeInViewProps) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.99)).current;

  useEffect(() => {
    if (!isFocused) {
      opacity.setValue(0);
      translateY.setValue(14);
      scale.setValue(0.99);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: duration + 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: duration + 60,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [duration, isFocused, opacity, scale, translateY]);

  return (
    <Animated.View style={[styles.wrapper, style, { opacity, transform: [{ translateY }, { scale }] }]}> 
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
