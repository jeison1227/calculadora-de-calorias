import AsyncStorage from '@react-native-async-storage/async-storage';

export const MEAL_HISTORY_KEY = 'mealHistory';

export type MealMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealFood = MealMacros & {
  name: string;
};

export type MealHistoryItem = {
  id: string;
  createdAt: string;
  foods: MealFood[];
  totals: MealMacros;
  notes?: string | null;
  imageUri?: string | null;
  source?: 'camera' | 'manual';
};

export const toNumber = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export const getMealHistory = async (): Promise<MealHistoryItem[]> => {
  const raw = await AsyncStorage.getItem(MEAL_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveMealHistory = async (meals: MealHistoryItem[]) => {
  await AsyncStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(meals));
};

export const addMealToHistory = async (meal: Omit<MealHistoryItem, 'id' | 'createdAt'>) => {
  const history = await getMealHistory();
  const newMeal: MealHistoryItem = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...meal,
  };
  const nextHistory = [newMeal, ...history];
  await saveMealHistory(nextHistory);
  return newMeal;
};

export const deleteMealFromHistory = async (mealId: string) => {
  const history = await getMealHistory();
  const nextHistory = history.filter(meal => meal.id !== mealId);
  await saveMealHistory(nextHistory);
  return nextHistory;
};
