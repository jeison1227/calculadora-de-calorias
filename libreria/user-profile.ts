import AsyncStorage from '@react-native-async-storage/async-storage';

export type GoalType = 'lose_weight' | 'maintain' | 'gain_muscle';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type UserProfile = {
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  dailyCalorieGoal: number;
  goal: GoalType;
};

const PROFILE_KEY = 'userProfile';

export const defaultUserProfile: UserProfile = {
  weight: 70,
  height: 172,
  age: 29,
  activityLevel: 'moderate',
  dailyCalorieGoal: 2100,
  goal: 'maintain',
};

export const toSafeNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const sanitizeProfile = (raw: Partial<UserProfile>): UserProfile => ({
  weight: Math.max(30, toSafeNumber(raw.weight, defaultUserProfile.weight)),
  height: Math.max(120, toSafeNumber(raw.height, defaultUserProfile.height)),
  age: Math.max(12, toSafeNumber(raw.age, defaultUserProfile.age)),
  activityLevel: raw.activityLevel ?? defaultUserProfile.activityLevel,
  dailyCalorieGoal: Math.max(1000, toSafeNumber(raw.dailyCalorieGoal, defaultUserProfile.dailyCalorieGoal)),
  goal: raw.goal ?? defaultUserProfile.goal,
});

export const getUserProfile = async (): Promise<UserProfile> => {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return defaultUserProfile;

  try {
    return sanitizeProfile(JSON.parse(raw));
  } catch {
    return defaultUserProfile;
  }
};

export const saveUserProfile = async (profile: UserProfile) => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(sanitizeProfile(profile)));
};
