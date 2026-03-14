export type UserGoal = 'lose_weight' | 'maintain' | 'gain_muscle';

export type MealSuggestion = {
  meal: string;
  suggestion: string;
};

export type HealthyRecipe = {
  name: string;
  prepTime: string;
  benefits: string;
};

export type NutritionPlan = {
  title: string;
  analysis: string;
  dailyCalories: string;
  proteinFocus: string;
  meals: MealSuggestion[];
  recipes: HealthyRecipe[];
};

const plansByGoal: Record<UserGoal, NutritionPlan> = {
  lose_weight: {
    title: 'Plan IA para pérdida de grasa',
    analysis:
      'Tu objetivo prioriza déficit calórico moderado, alta saciedad y proteína suficiente para proteger masa muscular.',
    dailyCalories: '1,700 - 1,900 kcal/día',
    proteinFocus: '1.6 - 2.0 g de proteína por kg corporal',
    meals: [
      { meal: 'Desayuno', suggestion: 'Yogur griego natural con avena, frutos rojos y semillas de chía.' },
      { meal: 'Almuerzo', suggestion: 'Ensalada grande con pollo a la plancha, quinoa y aceite de oliva.' },
      { meal: 'Cena', suggestion: 'Salmón al horno con verduras asadas y puré de coliflor.' },
      { meal: 'Snack', suggestion: 'Manzana con 1 cucharada de crema de cacahuate natural.' },
    ],
    recipes: [
      {
        name: 'Bowl de quinoa, espinaca y pollo',
        prepTime: '20 min',
        benefits: 'Alto en proteína y fibra para mejorar la saciedad.',
      },
      {
        name: 'Crema de calabaza sin nata',
        prepTime: '25 min',
        benefits: 'Baja en calorías y rica en micronutrientes.',
      },
    ],
  },
  maintain: {
    title: 'Plan IA para mantenimiento',
    analysis:
      'Tu prioridad es estabilidad: energía sostenida, distribución equilibrada de macros y hábitos consistentes.',
    dailyCalories: '2,000 - 2,300 kcal/día',
    proteinFocus: '1.4 - 1.8 g de proteína por kg corporal',
    meals: [
      { meal: 'Desayuno', suggestion: 'Tostadas integrales con aguacate, huevo y tomate.' },
      { meal: 'Almuerzo', suggestion: 'Arroz integral con pavo, verduras salteadas y legumbres.' },
      { meal: 'Cena', suggestion: 'Tacos de pescado con repollo, pico de gallo y yogur natural.' },
      { meal: 'Snack', suggestion: 'Mix de nueces + fruta fresca de temporada.' },
    ],
    recipes: [
      {
        name: 'Pasta integral con atún y vegetales',
        prepTime: '18 min',
        benefits: 'Balance ideal de carbohidratos complejos y proteína.',
      },
      {
        name: 'Omelette de vegetales y queso fresco',
        prepTime: '12 min',
        benefits: 'Fácil de preparar y denso en nutrientes.',
      },
    ],
  },
  gain_muscle: {
    title: 'Plan IA para ganancia muscular',
    analysis:
      'Tu objetivo requiere superávit controlado con alto aporte de proteína y carbohidratos para mejorar el rendimiento.',
    dailyCalories: '2,400 - 2,800 kcal/día',
    proteinFocus: '1.8 - 2.2 g de proteína por kg corporal',
    meals: [
      { meal: 'Desayuno', suggestion: 'Avena cocida en leche con plátano, nueces y proteína en polvo.' },
      { meal: 'Almuerzo', suggestion: 'Bowl de arroz, carne magra, frijoles y verduras al vapor.' },
      { meal: 'Cena', suggestion: 'Pechuga de pollo con papas al horno y ensalada con aceite de oliva.' },
      { meal: 'Snack', suggestion: 'Batido de yogur griego, frutas y mantequilla de almendra.' },
    ],
    recipes: [
      {
        name: 'Wrap integral de pavo y hummus',
        prepTime: '15 min',
        benefits: 'Alta densidad proteica y práctica para después de entrenar.',
      },
      {
        name: 'Chili de res magra con frijoles',
        prepTime: '30 min',
        benefits: 'Comida completa con proteína, hierro y carbohidratos.',
      },
    ],
  },
};

export function generateNutritionRecommendation(goal: UserGoal): NutritionPlan {
  return plansByGoal[goal];
}

export const goalLabels: Record<UserGoal, string> = {
  lose_weight: 'Perder peso',
  maintain: 'Mantener',
  gain_muscle: 'Ganar músculo',
};
