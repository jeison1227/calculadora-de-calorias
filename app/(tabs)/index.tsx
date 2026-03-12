import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { CircularCalorieProgress } from '@/components/ui/circular-calorie-progress';
import { FadeInView } from '@/components/ui/fade-in-view';
import { palette, radius, spacing, typography } from '@/constants/design-system';

const dailyCalories = {
  consumed: 1420,
  target: 2000,
};

const macroNutrients = [
  { label: 'Protein', value: 118, unit: 'g', color: '#22C55E', icon: 'food-steak' as const },
  { label: 'Carbs', value: 176, unit: 'g', color: '#0EA5E9', icon: 'grain' as const },
  { label: 'Fat', value: 54, unit: 'g', color: '#F97316', icon: 'peanut' as const },
];

const todaysMeals = [
  { title: 'Breakfast', subtitle: 'Greek yogurt, granola and berries', kcal: 380, icon: 'coffee-outline' as const },
  { title: 'Lunch', subtitle: 'Chicken bowl with quinoa and avocado', kcal: 560, icon: 'food-turkey' as const },
  { title: 'Snack', subtitle: 'Protein shake with banana', kcal: 210, icon: 'cup-outline' as const },
  { title: 'Dinner', subtitle: 'Salmon, sweet potato and greens', kcal: 270, icon: 'fish' as const },
];

export default function HomeScreen() {
  const remaining = dailyCalories.target - dailyCalories.consumed;

  return (
    <FadeInView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>Today</Text>
            <Text style={styles.title}>Nutrition Dashboard</Text>
          </View>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="run-fast" size={20} color={palette.primary} />
          </View>
        </View>

        <Card style={styles.mainCard}>
          <Text style={styles.sectionLabel}>Daily calories consumed</Text>
          <View style={styles.progressWrap}>
            <CircularCalorieProgress consumed={dailyCalories.consumed} target={dailyCalories.target} />
            <View style={styles.progressLegend}>
              <View style={styles.legendPill}>
                <Text style={styles.legendValue}>{dailyCalories.consumed} kcal</Text>
                <Text style={styles.legendLabel}>Consumed</Text>
              </View>
              <View style={styles.legendPill}>
                <Text style={styles.legendValue}>{remaining} kcal</Text>
                <Text style={styles.legendLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Macro nutrients</Text>
        </View>
        <View style={styles.macrosRow}>
          {macroNutrients.map((macro) => (
            <Card key={macro.label} style={styles.macroCard}>
              <View style={[styles.macroIcon, { backgroundColor: `${macro.color}22` }]}>
                <MaterialCommunityIcons name={macro.icon} size={18} color={macro.color} />
              </View>
              <Text style={styles.macroValue}>{macro.value}{macro.unit}</Text>
              <Text style={styles.macroLabel}>{macro.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s meals</Text>
        </View>
        <View style={styles.mealsGrid}>
          {todaysMeals.map((meal) => (
            <Card key={meal.title} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealIcon}>
                  <MaterialCommunityIcons name={meal.icon} size={18} color={palette.primary} />
                </View>
                <Text style={styles.mealCalories}>{meal.kcal} kcal</Text>
              </View>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealSubtitle}>{meal.subtitle}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overline: {
    ...typography.caption,
    color: palette.primary,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.subtitle,
    fontSize: 28,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#285E42',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10211A',
  },
  mainCard: {
    backgroundColor: '#0D172D',
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.body,
    color: '#AFBFDF',
  },
  progressWrap: {
    alignItems: 'center',
    gap: spacing.md,
  },
  progressLegend: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  legendPill: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#2A416D',
    padding: spacing.sm,
    alignItems: 'center',
    backgroundColor: '#162746',
  },
  legendValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  legendLabel: {
    ...typography.caption,
    color: '#8AA0CB',
  },
  sectionHeader: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  macroCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111F3D',
  },
  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    ...typography.subtitle,
    fontSize: 20,
  },
  macroLabel: {
    ...typography.caption,
  },
  mealsGrid: {
    gap: spacing.sm,
  },
  mealCard: {
    backgroundColor: '#101E39',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#143225',
  },
  mealCalories: {
    ...typography.caption,
    color: palette.primary,
  },
  mealTitle: {
    ...typography.body,
    color: palette.textPrimary,
    fontSize: 16,
  },
  mealSubtitle: {
    ...typography.caption,
    color: '#90A8D5',
  },
});
