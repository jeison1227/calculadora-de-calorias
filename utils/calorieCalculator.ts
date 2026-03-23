export type Gender = 'male' | 'female';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type GoalType = 'lose_weight' | 'maintain' | 'gain_weight';

export type CalorieCalculatorInput = {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: GoalType;
};

export type CalorieCalculationResult = {
  bmr: number;
  activityFactor: number;
  maintenanceCalories: number;
  adjustmentCalories: number;
  dailyCalories: number;
  explanation: string;
};

const activityFactors: Record<ActivityLevel, number> = {
  low: 1.2,
  moderate: 1.55,
  high: 1.9,
};

const goalAdjustments: Record<GoalType, number> = {
  lose_weight: -400,
  maintain: 0,
  gain_weight: 400,
};

const goalCopy: Record<GoalType, string> = {
  lose_weight: 'support a steady fat-loss phase',
  maintain: 'maintain your current body weight',
  gain_weight: 'support a gradual weight-gain phase',
};

export function calculateDailyCalories(input: CalorieCalculatorInput): CalorieCalculationResult {
  const bmr = input.gender === 'male'
    ? (10 * input.weight) + (6.25 * input.height) - (5 * input.age) + 5
    : (10 * input.weight) + (6.25 * input.height) - (5 * input.age) - 161;

  const activityFactor = activityFactors[input.activityLevel];
  const maintenanceCalories = Math.round(bmr * activityFactor);
  const adjustmentCalories = goalAdjustments[input.goal];
  const dailyCalories = Math.max(1200, maintenanceCalories + adjustmentCalories);
  const adjustmentText = adjustmentCalories === 0
    ? 'No extra calorie adjustment was applied for maintenance.'
    : `${adjustmentCalories > 0 ? 'A' : 'A'} ${Math.abs(adjustmentCalories)} kcal adjustment was applied within the recommended 300–500 kcal range for your goal.`;

  return {
    bmr: Math.round(bmr),
    activityFactor,
    maintenanceCalories,
    adjustmentCalories,
    dailyCalories,
    explanation: `We estimated your basal metabolic rate at ${Math.round(bmr)} kcal/day using the Mifflin-St Jeor equation, then multiplied it by an activity factor of ${activityFactor}. ${adjustmentText} Your final target of ${dailyCalories} kcal/day is designed to ${goalCopy[input.goal]}.`,
  };
}
