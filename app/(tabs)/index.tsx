import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { CircularCalorieProgress } from '@/components/ui/circular-calorie-progress';
import { FadeInView } from '@/components/ui/fade-in-view';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { deleteMealFromHistory, getMealHistory, MealHistoryItem } from '@/libreria/meal-history';

const dailyCalorieTarget = 2000;

const formatDay = (dateIso: string) =>
  new Date(dateIso).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });

export default function HomeScreen() {
  const [history, setHistory] = useState<MealHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const meals = await getMealHistory();
      setHistory(meals);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const dailyTotals = useMemo(() => {
    if (!history.length) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const today = new Date().toISOString().slice(0, 10);
    return history
      .filter(meal => meal.createdAt.slice(0, 10) === today)
      .reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.totals.calories,
          protein: acc.protein + meal.totals.protein,
          carbs: acc.carbs + meal.totals.carbs,
          fat: acc.fat + meal.totals.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
  }, [history]);

  const groupedByDay = useMemo(() => {
    const grouped = history.reduce<Record<string, MealHistoryItem[]>>((acc, meal) => {
      const key = meal.createdAt.slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(meal);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([dayKey, meals]) => ({
        dayKey,
        title: formatDay(meals[0]?.createdAt ?? dayKey),
        meals,
      }));
  }, [history]);

  const handleDelete = (meal: MealHistoryItem) => {
    Alert.alert('Eliminar comida', '¿Quieres eliminar esta comida del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(meal.id);
          try {
            const next = await deleteMealFromHistory(meal.id);
            setHistory(next);
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const remaining = dailyCalorieTarget - dailyTotals.calories;

  return (
    <FadeInView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>Hoy</Text>
            <Text style={styles.title}>Historial de comidas</Text>
          </View>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="history" size={20} color={palette.primary} />
          </View>
        </View>

        <Card style={styles.mainCard}>
          <Text style={styles.sectionLabel}>Calorías del día</Text>
          <View style={styles.progressWrap}>
            <CircularCalorieProgress consumed={Math.round(dailyTotals.calories)} target={dailyCalorieTarget} />
            <View style={styles.progressLegend}>
              <View style={styles.legendPill}>
                <Text style={styles.legendValue}>{Math.round(dailyTotals.calories)} kcal</Text>
                <Text style={styles.legendLabel}>Consumidas</Text>
              </View>
              <View style={styles.legendPill}>
                <Text style={styles.legendValue}>{Math.max(0, Math.round(remaining))} kcal</Text>
                <Text style={styles.legendLabel}>Restantes</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Macros de hoy</Text>
        </View>
        <View style={styles.macrosRow}>
          <Card style={styles.macroCard}>
            <Text style={styles.macroValue}>{Math.round(dailyTotals.protein)}g</Text>
            <Text style={styles.macroLabel}>Proteína</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroValue}>{Math.round(dailyTotals.carbs)}g</Text>
            <Text style={styles.macroLabel}>Carbohidratos</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroValue}>{Math.round(dailyTotals.fat)}g</Text>
            <Text style={styles.macroLabel}>Grasa</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Comidas por día</Text>
        </View>

        {!loading && !groupedByDay.length && (
          <Card>
            <Text style={styles.emptyText}>Aún no hay comidas guardadas. Analiza una comida y guárdala para verla aquí.</Text>
          </Card>
        )}

        {groupedByDay.map(group => (
          <View key={group.dayKey} style={styles.dayGroup}>
            <Text style={styles.dayTitle}>{group.title}</Text>
            {group.meals.map(meal => (
              <Card key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealCalories}>{Math.round(meal.totals.calories)} kcal</Text>
                  <AppButton
                    title="Eliminar"
                    variant="ghost"
                    onPress={() => handleDelete(meal)}
                    loading={deletingId === meal.id}
                  />
                </View>
                <Text style={styles.mealSubtitle}>
                  P {Math.round(meal.totals.protein)}g · C {Math.round(meal.totals.carbs)}g · G {Math.round(meal.totals.fat)}g
                </Text>
                {!!meal.foods?.length && (
                  <View style={styles.foodList}>
                    {meal.foods.map((food, index) => (
                      <Text key={`${meal.id}-${index}`} style={styles.foodItem}>• {food.name}</Text>
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overline: { ...typography.caption, color: palette.primary, textTransform: 'uppercase' },
  title: { ...typography.subtitle, fontSize: 28 },
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
  mainCard: { backgroundColor: '#0D172D', gap: spacing.md },
  sectionLabel: { ...typography.body, color: '#AFBFDF' },
  progressWrap: { alignItems: 'center', gap: spacing.md },
  progressLegend: { width: '100%', flexDirection: 'row', gap: spacing.sm },
  legendPill: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#2A416D',
    padding: spacing.sm,
    alignItems: 'center',
    backgroundColor: '#162746',
  },
  legendValue: { ...typography.body, color: palette.textPrimary, fontWeight: '700' },
  legendLabel: { ...typography.caption, color: '#8AA0CB' },
  sectionHeader: { marginTop: spacing.xs },
  sectionTitle: { ...typography.subtitle, fontSize: 20 },
  macrosRow: { flexDirection: 'row', gap: spacing.sm },
  macroCard: { flex: 1, alignItems: 'center', backgroundColor: '#111F3D' },
  macroValue: { ...typography.subtitle, fontSize: 20 },
  macroLabel: { ...typography.caption },
  dayGroup: { gap: spacing.xs },
  dayTitle: { ...typography.subtitle, textTransform: 'capitalize' },
  mealCard: { backgroundColor: '#101E39', gap: spacing.xs },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealCalories: { ...typography.body, color: palette.primary, fontWeight: '700' },
  mealSubtitle: { ...typography.caption, color: '#90A8D5' },
  foodList: { gap: 2 },
  foodItem: { ...typography.caption, color: palette.textPrimary },
  emptyText: { ...typography.body, color: palette.textPrimary },
});
