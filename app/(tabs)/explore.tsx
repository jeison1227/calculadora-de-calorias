import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { radius, spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

const metrics = [
  { label: 'Racha', value: '6 días', icon: 'fire' as const },
  { label: 'Promedio', value: '1,940 kcal', icon: 'chart-line' as const },
  { label: 'Hidratación', value: '2.1 / 2.5 L', icon: 'cup-water' as const },
];

export default function InsightsScreen() {
  const { colors, typography } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header title="Insights de progreso" subtitle="Visualiza tus hábitos semanales y mantén consistencia como en apps top de fitness." />

        <Card>
          <Text style={styles.cardTitle}>Estado semanal</Text>
          <View style={styles.metricGrid}>
            {metrics.map(metric => (
              <View key={metric.label} style={styles.metricCard}>
                <MaterialCommunityIcons name={metric.icon} size={18} color={colors.primary} />
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Recomendación del día</Text>
          <Text style={styles.cardBody}>Mantén tu proteína por encima de 130g y añade una caminata de 20 minutos para cerrar el día con mejor adherencia.</Text>
        </Card>
      </ScrollView>
    </FadeInView>
  );
}

const createStyles = (colors: any, typography: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  cardTitle: { ...typography.subtitle },
  metricGrid: { flexDirection: 'row', gap: spacing.sm },
  metricCard: { flex: 1, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.backgroundSoft, padding: spacing.sm, gap: 6 },
  metricValue: { ...typography.body, color: colors.textPrimary },
  metricLabel: { ...typography.caption },
  cardBody: { ...typography.body },
});
