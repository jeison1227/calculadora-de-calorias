import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const { colors, typography } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.caption, { color: colors.primary, letterSpacing: 1 }]}>NUTRITION INSIGHTS</Text>
      <Text style={typography.title}>{title}</Text>
      <Text style={typography.body}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
});
