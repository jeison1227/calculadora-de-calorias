import { MealHistoryItem } from '@/libreria/meal-history';

export const isoDay = (value: string) => value.slice(0, 10);

export const getTodayTotals = (history: MealHistoryItem[]) => {
  const today = new Date().toISOString().slice(0, 10);
  return history
    .filter(item => isoDay(item.createdAt) === today)
    .reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totals.calories,
        protein: acc.protein + meal.totals.protein,
        carbs: acc.carbs + meal.totals.carbs,
        fat: acc.fat + meal.totals.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
};

export const getWeeklyCalories = (history: MealHistoryItem[]) => {
  const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  return labels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const dayKey = day.toISOString().slice(0, 10);

    const calories = history
      .filter(item => isoDay(item.createdAt) === dayKey)
      .reduce((sum, meal) => sum + meal.totals.calories, 0);

    return { day: label, calories: Math.round(calories), dateKey: dayKey };
  });
};

export const groupMealsByDay = (history: MealHistoryItem[]) => {
  const grouped = history.reduce<Record<string, MealHistoryItem[]>>((acc, meal) => {
    const key = isoDay(meal.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(meal);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([dayKey, meals]) => ({ dayKey, meals }));
};
