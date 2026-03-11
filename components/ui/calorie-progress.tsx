import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/design-system';

type CalorieProgressProps = {
  consumed: number;
  target: number;
};

export function CalorieProgress({ consumed, target }: CalorieProgressProps) {
  const progress = useMemo(() => Math.min(consumed / target, 1), [consumed, target]);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.labels}>
        <Text style={styles.title}>Progreso de calorías</Text>
        <Text style={styles.value}>{consumed} / {target} kcal</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
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
    color: palette.textPrimary,
    fontWeight: '700',
  },
  value: {
    ...typography.caption,
    color: palette.primaryDark,
    fontWeight: '700',
  },
  track: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: '#DBEAFE',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
  },
});
