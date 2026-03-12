import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

type CalorieProgressProps = {
  consumed: number;
  target: number;
};

export function CalorieProgress({ consumed, target }: CalorieProgressProps) {
  const { colors, typography } = useAppTheme();
  const progress = useMemo(() => Math.min(consumed / target, 1), [consumed, target]);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 650,
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
        <Text style={[typography.caption, { color: colors.textSecondary }]}>Calorías de hoy</Text>
        <Text style={[typography.caption, { color: colors.primary }]}>{consumed} / {target} kcal</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}> 
        <Animated.View style={[styles.fill, { width, backgroundColor: colors.primary }]} />
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
  track: {
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
