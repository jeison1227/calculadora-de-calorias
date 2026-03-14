import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/design-system';

type CircularCalorieProgressProps = {
  consumed: number;
  target: number;
  size?: number;
};

export function CircularCalorieProgress({ consumed, target, size = 180 }: CircularCalorieProgressProps) {
  const safeTarget = target > 0 ? target : 1;
  const progress = Math.min(consumed / safeTarget, 1);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      speed: 14,
      bounciness: 6,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();

    return () => floatLoop.stop();
  }, [float]);

  const percent = useMemo(() => Math.round(progress * 100), [progress]);

  const animatedBorderColor = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${palette.primary}22`, `${palette.primary}88`],
  });

  const ringScale = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });

  const badgeTranslate = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}> 
      <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]}> 
        <Animated.View
          style={[
            styles.progressRing,
            {
              width: size - 26,
              height: size - 26,
              borderRadius: (size - 26) / 2,
              borderColor: animatedBorderColor,
              transform: [{ scale: ringScale }],
            },
          ]}
        >
          <View style={styles.centerContent}>
            <Text style={styles.consumed}>{consumed}</Text>
            <Text style={styles.target}>/ {target} kcal</Text>
          </View>
        </Animated.View>
      </View>
      <Animated.View style={[styles.badge, { transform: [{ translateY: badgeTranslate }] }]}>
        <Text style={styles.badgeText}>{percent}%</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    borderWidth: 12,
    borderColor: '#1F325B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C1831',
  },
  centerContent: {
    alignItems: 'center',
  },
  consumed: {
    ...typography.subtitle,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  target: {
    ...typography.caption,
    color: '#93A9D1',
    fontSize: 13,
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#143225',
    borderColor: '#2A7D52',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
  },
});
