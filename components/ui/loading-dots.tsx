import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type LoadingDotsProps = {
  label?: string;
};

export function LoadingDots({ label = 'Analizando comida...' }: LoadingDotsProps) {
  const { colors, typography } = useAppTheme();
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse, spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <MaterialCommunityIcons name="food-apple" size={20} color={colors.primary} />
      </Animated.View>
      <View style={styles.dotsRow}>
        {[0, 1, 2].map(index => (
          <Animated.View key={index} style={[styles.dot, { opacity: pulse, transform: [{ scale: pulse }], backgroundColor: colors.primary }]} />
        ))}
      </View>
      <Text style={[typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>{label}</Text>
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
  },
});
