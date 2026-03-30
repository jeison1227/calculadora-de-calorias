import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette, radius, spacing, typography } from '@/constants/design-system';

type LoadingOverlayProps = {
  visible: boolean;
  label?: string;
};

export function LoadingOverlay({ visible, label = 'Analizando alimento...' }: LoadingOverlayProps) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      rotation.value = 0;
      pulse.value = 0;
      return;
    }

    rotation.value = withRepeat(
      withTiming(1, {
        duration: 900,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulse.value = withRepeat(
      withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, [pulse, rotation, visible]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }, { scale: interpolate(pulse.value, [0, 1], [1, 1.08]) }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.2, 0.45]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.18]) }],
  }));

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={styles.overlay}>
      <View style={styles.card}>
        <Animated.View style={[styles.halo, haloStyle]} />
        <Animated.View style={[styles.spinnerWrap, spinnerStyle]}>
          <MaterialCommunityIcons name="food-apple-outline" size={28} color={palette.primary} />
        </Animated.View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 10, 24, 0.68)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing.lg,
  },
  card: {
    minWidth: 220,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(17, 27, 47, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(36, 58, 100, 0.9)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  halo: {
    position: 'absolute',
    top: 18,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
  spinnerWrap: {
    width: 62,
    height: 62,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.24)',
    backgroundColor: '#10203C',
  },
  label: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
});
