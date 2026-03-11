import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/constants/design-system';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>NUTRITION INSIGHTS</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  kicker: {
    ...typography.caption,
    color: palette.primary,
    letterSpacing: 1,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
  },
});
