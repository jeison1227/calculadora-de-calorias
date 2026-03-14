import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { CalorieProgress } from '@/components/ui/calorie-progress';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { generateMealPlan } from '@/libreria/ai-planner';
import { getMealHistory, MealHistoryItem } from '@/libreria/meal-history';
import { getTodayTotals, getWeeklyCalories } from '@/libreria/nutrition-analytics';
import { defaultUserProfile, getUserProfile, UserProfile } from '@/libreria/user-profile';

export default function HomeScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<MealHistoryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);

  const loadData = useCallback(async () => {
    const [meals, user] = await Promise.all([getMealHistory(), getUserProfile()]);
    setHistory(meals);
    setProfile(user);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const todayTotals = useMemo(() => getTodayTotals(history), [history]);
  const weeklyCalories = useMemo(() => getWeeklyCalories(history), [history]);
  const weeklyPeak = Math.max(1, ...weeklyCalories.map(item => item.calories));
  const plan = useMemo(() => generateMealPlan(profile), [profile]);

  return (
    <FadeInView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="AI Nutrition Assistant" subtitle="Tu panel profesional de calorías, macros, planificación y progreso semanal." />

        <Card style={styles.dashboardCard}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>Dashboard diario</Text>
            <View style={styles.goalBadge}>
              <MaterialCommunityIcons name="target" size={14} color={palette.primary} />
              <Text style={styles.goalBadgeText}>{profile.dailyCalorieGoal} kcal</Text>
            </View>
          </View>

          <CalorieProgress consumed={Math.round(todayTotals.calories)} target={profile.dailyCalorieGoal} />

          <View style={styles.macroGrid}>
            {[
              { label: 'Protein', value: `${Math.round(todayTotals.protein)}g`, icon: 'food-drumstick-outline' as const },
              { label: 'Carbs', value: `${Math.round(todayTotals.carbs)}g`, icon: 'bread-slice-outline' as const },
              { label: 'Fat', value: `${Math.round(todayTotals.fat)}g`, icon: 'peanut-outline' as const },
            ].map(item => (
              <View key={item.label} style={styles.macroTile}>
                <MaterialCommunityIcons name={item.icon} size={16} color={palette.primary} />
                <Text style={styles.macroValue}>{item.value}</Text>
                <Text style={styles.macroLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <View style={{ flex: 1 }}><AppButton title="Scan Food" onPress={() => router.push('/camera')} /></View>
            <View style={{ flex: 1 }}><AppButton title="Recipes" variant="ghost" onPress={() => router.push('/recipes')} /></View>
          </View>
        </Card>

        <Card>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>Estadísticas semanales</Text>
            <Text style={styles.subtle}>tracking</Text>
          </View>
          <View style={styles.weeklyBars}>
            {weeklyCalories.map(item => (
              <View key={item.dateKey} style={styles.barColumn}>
                <Text style={styles.barValue}>{item.calories}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(8, (item.calories / weeklyPeak) * 100)}%`,
                        backgroundColor: item.calories >= profile.dailyCalorieGoal ? palette.primary : '#395C95',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>AI Diet Planner</Text>
          <Text style={styles.planHint}>{plan.coachingTip}</Text>
          {plan.meals.map(meal => (
            <View key={meal.name} style={styles.mealPlanRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealPlanTitle}>{meal.name}</Text>
                <Text style={styles.mealPlanFoods}>{meal.foods.join(' · ')}</Text>
              </View>
              <Text style={styles.mealPlanCalories}>{meal.calories} kcal</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  dashboardCard: { backgroundColor: '#101B33' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...typography.subtitle, fontSize: 20 },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: '#152540',
  },
  goalBadgeText: { ...typography.caption, color: palette.primary },
  macroGrid: { flexDirection: 'row', gap: spacing.sm },
  macroTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceElevated,
    borderRadius: radius.md,
    alignItems: 'center',
    padding: spacing.sm,
    gap: 4,
  },
  macroValue: { ...typography.body, color: palette.textPrimary, fontWeight: '800' },
  macroLabel: { ...typography.caption },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  subtle: { ...typography.caption, textTransform: 'uppercase' },
  weeklyBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xs },
  barColumn: { flex: 1, alignItems: 'center', gap: 5 },
  barValue: { ...typography.caption, fontSize: 10 },
  barTrack: {
    width: '100%',
    height: 110,
    borderRadius: radius.sm,
    backgroundColor: '#0B152B',
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm },
  barLabel: { ...typography.caption, color: palette.textPrimary },
  planHint: { ...typography.body },
  mealPlanRow: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: '#12203B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mealPlanTitle: { ...typography.body, color: palette.textPrimary, fontWeight: '700' },
  mealPlanFoods: { ...typography.caption },
  mealPlanCalories: { ...typography.body, color: palette.primary, fontWeight: '800' },
});
