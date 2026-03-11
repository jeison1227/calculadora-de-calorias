import { ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/card';
import { palette, spacing, typography } from '@/constants/design-system';

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tu progreso</Text>
      <Text style={styles.subtitle}>Panel semanal para mantener consistencia y mejorar hábitos.</Text>

      <Card>
        <Text style={styles.cardTitle}>Racha actual</Text>
        <Text style={styles.bigMetric}>6 días</Text>
        <Text style={styles.cardBody}>Has registrado alimentos de forma continua esta semana.</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Objetivo de hidratación</Text>
        <Text style={styles.cardBody}>2.1 / 2.5 litros hoy</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Promedio calórico</Text>
        <Text style={styles.cardBody}>1,940 kcal en los últimos 7 días.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  cardTitle: { ...typography.subtitle },
  cardBody: { ...typography.body },
  bigMetric: {
    fontSize: 36,
    fontWeight: '800',
    color: palette.primary,
  },
});
