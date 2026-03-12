import { StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/design-system';

type CircularCalorieProgressProps = {
  consumed: number;
  target: number;
  size?: number;
};

export function CircularCalorieProgress({ consumed, target, size = 180 }: CircularCalorieProgressProps) {
  const progress = Math.min(consumed / target, 1);
  const percent = Math.round(progress * 100);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]}>
        <View
          style={[
            styles.progressRing,
            {
              width: size - 26,
              height: size - 26,
              borderRadius: (size - 26) / 2,
              borderColor: `${palette.primary}${percent > 0 ? '55' : '22'}`,
            },
          ]}
        >
          <View style={styles.centerContent}>
            <Text style={styles.consumed}>{consumed}</Text>
            <Text style={styles.target}>/ {target} kcal</Text>
          </View>
        </View>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{percent}%</Text>
      </View>
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
