import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, radius, spacing, typography } from '@/constants/design-system';

const weeklyCalories = [
  { day: 'L', calories: 1780 },
  { day: 'M', calories: 2010 },
  { day: 'X', calories: 1860 },
  { day: 'J', calories: 2140 },
  { day: 'V', calories: 1950 },
  { day: 'S', calories: 2280 },
  { day: 'D', calories: 1900 },
];

const macros = [
  { name: 'Proteína', grams: 132, color: '#22C55E', icon: 'food-drumstick-outline' as const },
  { name: 'Carbohidratos', grams: 210, color: '#0EA5E9', icon: 'bread-slice-outline' as const },
  { name: 'Grasas', grams: 64, color: '#F97316', icon: 'peanut-outline' as const },
];

export default function InsightsScreen() {
  const totalWeekCalories = weeklyCalories.reduce((sum, item) => sum + item.calories, 0);
  const dailyAverage = Math.round(totalWeekCalories / weeklyCalories.length);
  const highestCalorie = Math.max(...weeklyCalories.map(item => item.calories));

  const totalMacroGrams = macros.reduce((sum, item) => sum + item.grams, 0);

  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header title="Estadísticas" subtitle="Sigue tu avance con métricas semanales, promedios diarios y distribución de macronutrientes." />

        <View style={styles.quickStatsRow}>
          <Card style={styles.quickStatCard}>
            <View style={styles.quickStatIconWrap}>
              <MaterialCommunityIcons name="chart-line" size={18} color={palette.primary} />
            </View>
            <Text style={styles.quickStatValue}>{dailyAverage.toLocaleString()} kcal</Text>
            <Text style={styles.quickStatLabel}>Promedio diario</Text>
          </Card>

          <Card style={styles.quickStatCard}>
            <View style={styles.quickStatIconWrap}>
              <MaterialCommunityIcons name="fire" size={18} color={palette.accent} />
            </View>
            <Text style={styles.quickStatValue}>{Math.max(...weeklyCalories.map(item => item.calories)).toLocaleString()} kcal</Text>
            <Text style={styles.quickStatLabel}>Pico semanal</Text>
          </Card>
        </View>

        <Card>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Consumo semanal</Text>
            <Text style={styles.cardHint}>Objetivo: 2,000 kcal</Text>
          </View>

          <View style={styles.weeklyChart}>
            {weeklyCalories.map(item => {
              const heightPercent = Math.max(18, (item.calories / highestCalorie) * 100);
              const reachedGoal = item.calories >= 2000;

              return (
                <View key={item.day} style={styles.weeklyColumn}>
                  <Text style={styles.columnValue}>{item.calories}</Text>
                  <View style={styles.columnTrack}>
                    <View
                      style={[
                        styles.columnFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: reachedGoal ? palette.primary : '#2F4B7D',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.columnLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Distribución de macros</Text>
            <Text style={styles.cardHint}>{totalMacroGrams} g totales</Text>
          </View>

          <View style={styles.macroStackChart}>
            {macros.map(macro => {
              const widthPercent = (macro.grams / totalMacroGrams) * 100;
              return <View key={macro.name} style={[styles.macroStackSegment, { width: `${widthPercent}%`, backgroundColor: macro.color }]} />;
            })}
          </View>

          <View style={styles.macroList}>
            {macros.map(macro => {
              const percentage = Math.round((macro.grams / totalMacroGrams) * 100);
              return (
                <View key={macro.name} style={styles.macroRow}>
                  <View style={styles.macroNameWrap}>
                    <MaterialCommunityIcons name={macro.icon} size={16} color={macro.color} />
                    <Text style={styles.macroName}>{macro.name}</Text>
                  </View>
                  <Text style={styles.macroValue}>{macro.grams} g · {percentage}%</Text>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  quickStatsRow: { flexDirection: 'row', gap: spacing.sm },
  quickStatCard: { flex: 1, gap: 8, backgroundColor: palette.surfaceElevated },
  quickStatIconWrap: {
    alignSelf: 'flex-start',
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(8,16,34,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatValue: { ...typography.body, color: palette.textPrimary, fontSize: 16, fontWeight: '700' },
  quickStatLabel: { ...typography.caption },
  cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...typography.subtitle, fontSize: 19, lineHeight: 26 },
  cardHint: { ...typography.caption },
  weeklyChart: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  weeklyColumn: { flex: 1, alignItems: 'center', gap: 6 },
  columnValue: { ...typography.caption, fontSize: 10 },
  columnTrack: {
    width: '100%',
    height: 132,
    borderRadius: radius.sm,
    backgroundColor: '#0C1630',
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  columnFill: {
    width: '100%',
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  columnLabel: { ...typography.caption, color: palette.textPrimary },
  macroStackChart: {
    marginTop: spacing.xs,
    height: 20,
    borderRadius: radius.pill,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#0C1630',
  },
  macroStackSegment: { height: '100%' },
  macroList: { marginTop: spacing.sm, gap: spacing.xs },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  macroNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroName: { ...typography.body, color: palette.textPrimary },
  macroValue: { ...typography.caption, color: palette.textPrimary },
});
