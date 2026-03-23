import AsyncStorage from '@react-native-async-storage/async-storage';

import { ActivityLevel, Gender, GoalType } from '@/utils/calorieCalculator';

export type { ActivityLevel, Gender, GoalType };

export type UserProfile = {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  dailyCalorieGoal: number;
  goal: GoalType;
  isOnboardingComplete: boolean;
};

export type OnboardingProfile = UserProfile;

const PROFILE_KEY = 'userProfile';

export const defaultUserProfile: UserProfile = {
  weight: 70,
  height: 172,
  age: 29,
  gender: 'male',
  activityLevel: 'moderate',
  dailyCalorieGoal: 2100,
  goal: 'maintain',
  isOnboardingComplete: false,
};

export const toSafeNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const sanitizeProfile = (raw: Partial<UserProfile>): UserProfile => ({
  weight: Math.max(30, toSafeNumber(raw.weight, defaultUserProfile.weight)),
  height: Math.max(120, toSafeNumber(raw.height, defaultUserProfile.height)),
  age: Math.max(12, toSafeNumber(raw.age, defaultUserProfile.age)),
  gender: raw.gender === 'female' ? 'female' : 'male',
  activityLevel: raw.activityLevel === 'low' || raw.activityLevel === 'high' ? raw.activityLevel : 'moderate',
  dailyCalorieGoal: Math.max(1000, toSafeNumber(raw.dailyCalorieGoal, defaultUserProfile.dailyCalorieGoal)),
  goal: raw.goal === 'lose_weight' || raw.goal === 'gain_weight' ? raw.goal : 'maintain',
  isOnboardingComplete: Boolean(raw.isOnboardingComplete),
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

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    const profile = sanitizeProfile(parsed);
    return Boolean(
      profile.isOnboardingComplete
      || (parsed.age && parsed.height && parsed.weight && parsed.dailyCalorieGoal && parsed.activityLevel && parsed.goal)
    );
  } catch {
    return false;
  }
};

export const saveUserProfile = async (profile: Partial<UserProfile>) => {
  const previousProfile = await getUserProfile();
  const sanitizedProfile = sanitizeProfile({
    ...previousProfile,
    ...profile,
    isOnboardingComplete: profile.isOnboardingComplete ?? previousProfile.isOnboardingComplete,
  });
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(sanitizedProfile));
};
