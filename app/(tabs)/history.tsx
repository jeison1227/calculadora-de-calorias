import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, spacing, typography } from '@/constants/design-system';
import { deleteMealFromHistory, getMealHistory, MealHistoryItem } from '@/libreria/meal-history';
import { groupMealsByDay } from '@/libreria/nutrition-analytics';

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });

export default function HistoryScreen() {
  const [history, setHistory] = useState<MealHistoryItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const meals = await getMealHistory();
    setHistory(meals);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const grouped = useMemo(() => groupMealsByDay(history), [history]);

  const onDelete = (meal: MealHistoryItem) => {
    Alert.alert('Delete meal', 'Remove this meal from your history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(meal.id);
          const next = await deleteMealFromHistory(meal.id);
          setHistory(next);
          setDeletingId(null);
        },
      },
    ]);
  };

  return (
    <FadeInView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Meal History" subtitle="Registro completo de alimentos analizados, calorías y macros por día." />

        {!grouped.length && (
          <Card>
            <Text style={styles.empty}>No meals saved yet. Scan your first meal to build your history.</Text>
          </Card>
        )}

        {grouped.map(group => (
          <View key={group.dayKey} style={styles.dayBlock}>
            <Text style={styles.dayTitle}>{formatDay(group.dayKey)}</Text>
            {group.meals.map(meal => (
              <Card key={meal.id} style={styles.mealCard}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.mealCalories}>{Math.round(meal.totals.calories)} kcal</Text>
                    <Text style={styles.mealMacros}>
                      P {Math.round(meal.totals.protein)}g · C {Math.round(meal.totals.carbs)}g · F {Math.round(meal.totals.fat)}g
                    </Text>
                  </View>
                  <AppButton title="Delete" variant="ghost" loading={deletingId === meal.id} onPress={() => onDelete(meal)} />
                </View>

                {!!meal.foods.length && (
                  <View style={styles.foodList}>
                    {meal.foods.map((food, index) => (
                      <View key={`${meal.id}-${food.name}-${index}`} style={styles.foodRow}>
                        <MaterialCommunityIcons name="circle-small" size={16} color={palette.primary} />
                        <Text style={styles.foodText}>{food.name}</Text>
                      </View>
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
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  empty: { ...typography.body, color: palette.textPrimary },
  dayBlock: { gap: spacing.sm },
  dayTitle: { ...typography.subtitle, textTransform: 'capitalize', fontSize: 20 },
  mealCard: { backgroundColor: '#0F1B34' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  mealCalories: { ...typography.body, color: palette.primary, fontWeight: '800' },
  mealMacros: { ...typography.caption, color: '#9CB1D9' },
  foodList: { marginTop: spacing.xs },
  foodRow: { flexDirection: 'row', alignItems: 'center' },
  foodText: { ...typography.caption, color: palette.textPrimary },
});
