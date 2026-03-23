import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: toValue < 1 ? 110 : 180,
      easing: toValue < 1 ? Easing.out(Easing.quad) : Easing.out(Easing.back(1.6)),
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            // Add a soft haptic feedback when pressing down on the tabs.
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          animatePress(0.92);
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          animatePress(1);
          props.onPressOut?.(ev);
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
