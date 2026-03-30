import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/design-system';

type LoadingDotsProps = {
  label?: string;
};

export function LoadingDots({ label = 'Analizando comida...' }: LoadingDotsProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulseValues = useRef([new Animated.Value(0.35), new Animated.Value(0.35), new Animated.Value(0.35)]).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    const pulseLoops = pulseValues.map(pulse =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.timing(pulse, { toValue: 0.35, duration: 480, easing: Easing.in(Easing.quad), useNativeDriver: false }),
        ])
      )
    );

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 800, easing: Easing.out(Easing.sin), useNativeDriver: false }),
        Animated.timing(breathe, { toValue: 0, duration: 800, easing: Easing.in(Easing.sin), useNativeDriver: false }),
      ])
    );

    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    spinLoop.start();
    Animated.stagger(130, pulseLoops).start();
    breatheLoop.start();
    sweepLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoops.forEach(loop => loop.stop());
      breatheLoop.stop();
      sweepLoop.stop();
    };
  }, [breathe, pulseValues, spin, sweep]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const sweepTranslate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: rotation }, { scale: iconScale }] }}>
        <MaterialCommunityIcons name="food-apple" size={20} color={palette.primary} />
      </Animated.View>
      <View style={styles.dotsRow}>
        {pulseValues.map((pulse, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: pulse,
                transform: [{ scale: pulse }],
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressSweep, { transform: [{ translateX: sweepTranslate }] }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  progressTrack: {
    width: 120,
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#1F3158',
  },
  progressSweep: {
    width: 60,
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.primary,
    opacity: 0.75,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  label: {
    ...typography.caption,
    color: palette.textPrimary,
    fontWeight: '700',
  },
});
