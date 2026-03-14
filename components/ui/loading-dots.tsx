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

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.stagger(
      140,
      pulseValues.map(pulse =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 0.35, duration: 420, useNativeDriver: true }),
          ])
        )
      )
    ).start();
  }, [pulseValues, spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
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
