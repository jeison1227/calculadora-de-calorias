import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/design-system';

type CalorieProgressProps = {
  consumed: number;
  target: number;
};

export function CalorieProgress({ consumed, target }: CalorieProgressProps) {
  const progress = useMemo(() => {
    if (target <= 0) return 0;
    return Math.min(consumed / target, 1);
  }, [consumed, target]);
  const widthAnim = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: progress,
      speed: 14,
      bounciness: 4,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  useEffect(() => {
    shimmer.setValue(0);
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    shimmerLoop.start();

    return () => {
      shimmerLoop.stop();
    };
  }, [shimmer]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.labels}>
        <Text style={styles.title}>Calorías de hoy</Text>
        <Text style={styles.value}>{consumed} / {target} kcal</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]}>
          <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerTranslate }] }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.caption,
    color: '#D8E4FF',
  },
  value: {
    ...typography.caption,
    color: palette.primary,
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#243A64',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
    overflow: 'hidden',
  },
  shimmer: {
    width: 42,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    opacity: 0.55,
  },
});
