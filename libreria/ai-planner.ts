import { GoalType, UserProfile } from '@/libreria/user-profile';

export type MealPlanMeal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
};

export type DailyMealPlan = {
  goal: GoalType;
  totalCalories: number;
  meals: MealPlanMeal[];
  coachingTip: string;
};

const templates: Record<GoalType, { title: string; ratio: [number, number, number, number]; tip: string; mealNames: string[] }> = {
  lose_weight: {
    title: 'Pérdida de grasa',
    ratio: [0.26, 0.32, 0.3, 0.12],
    tip: 'Prioriza verduras de alto volumen y proteína magra para mantener saciedad.',
    mealNames: ['Desayuno proteico', 'Almuerzo balanceado', 'Snack ligero', 'Cena alta en proteína'],
  },
  maintain: {
    title: 'Mantenimiento',
    ratio: [0.25, 0.35, 0.25, 0.15],
    tip: 'Mantén horarios consistentes y un reparto uniforme de proteína durante el día.',
    mealNames: ['Desayuno energético', 'Almuerzo completo', 'Merienda funcional', 'Cena ligera'],
  },
  gain_weight: {
    title: 'Ganancia de peso',
    ratio: [0.24, 0.38, 0.26, 0.12],
    tip: 'Suma calorías de calidad con carbohidratos complejos, proteína y grasas saludables.',
    mealNames: ['Desayuno completo', 'Almuerzo performance', 'Snack estratégico', 'Cena de recuperación'],
  },
};

const foodPool = {
  protein: ['Pechuga de pollo', 'Yogur griego', 'Salmón', 'Tofu firme', 'Claras de huevo'],
  carbs: ['Avena', 'Arroz integral', 'Quinoa', 'Papa asada', 'Pan integral'],
  fat: ['Aguacate', 'Nueces', 'Aceite de oliva', 'Semillas de chía', 'Mantequilla de maní'],
  greens: ['Espinaca', 'Brócoli', 'Tomate cherry', 'Pepino', 'Pimientos'],
};

const buildMealFoods = (index: number) => [
  foodPool.protein[index % foodPool.protein.length],
  foodPool.carbs[index % foodPool.carbs.length],
  foodPool.fat[index % foodPool.fat.length],
  foodPool.greens[index % foodPool.greens.length],
];

export const generateMealPlan = (profile: UserProfile): DailyMealPlan => {
  const config = templates[profile.goal];
  const baseCalories = profile.dailyCalorieGoal;
  const totalCalories = profile.goal === 'lose_weight' ? Math.round(baseCalories * 0.9) : profile.goal === 'gain_weight' ? Math.round(baseCalories * 1.1) : baseCalories;

  const meals = config.ratio.map((share, index) => {
    const calories = Math.round(totalCalories * share);
    const protein = Math.round((calories * 0.3) / 4);
    const carbs = Math.round((calories * 0.42) / 4);
    const fat = Math.round((calories * 0.28) / 9);

    return {
      name: config.mealNames[index],
      calories,
      protein,
      carbs,
      fat,
      foods: buildMealFoods(index),
    };
  });

  return {
    goal: profile.goal,
    totalCalories,
    meals,
    coachingTip: `${config.title}: ${config.tip}`,
  };
};
