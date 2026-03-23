import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SelectOption } from '@/components/SelectOption';
import { Card } from '@/components/ui/card';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { OnboardingProfile, saveUserProfile } from '@/libreria/user-profile';
import { ActivityLevel, calculateDailyCalories, Gender, GoalType } from '@/utils/calorieCalculator';

type FormState = {
  age: string;
  weight: string;
  height: string;
  gender: Gender | '';
  activityLevel: ActivityLevel | '';
  goal: GoalType | '';
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  age: '',
  weight: '',
  height: '',
  gender: '',
  activityLevel: '',
  goal: '',
};

const genderOptions: { label: string; value: Gender; description: string }[] = [
  { label: 'Male', value: 'male', description: 'Uses the male Mifflin-St Jeor equation.' },
  { label: 'Female', value: 'female', description: 'Uses the female Mifflin-St Jeor equation.' },
];

const activityOptions: { label: string; value: ActivityLevel; description: string }[] = [
  { label: 'Low', value: 'low', description: 'Mostly seated or light movement.' },
  { label: 'Moderate', value: 'moderate', description: 'Regular walking or training a few days a week.' },
  { label: 'High', value: 'high', description: 'Very active lifestyle or intense training.' },
];

const goalOptions: { label: string; value: GoalType; description: string }[] = [
  { label: 'Lose weight', value: 'lose_weight', description: 'Creates a moderate calorie deficit.' },
  { label: 'Maintain weight', value: 'maintain', description: 'Keeps calories close to maintenance.' },
  { label: 'Gain weight', value: 'gain_weight', description: 'Creates a controlled calorie surplus.' },
];

const parseMetric = (value: string) => Number(value.replace(',', '.'));

export default function OnboardingScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultCalories, setResultCalories] = useState<number | null>(null);

  const canSubmit = useMemo(
    () => Object.values(form).every(Boolean) && !loading,
    [form, loading]
  );

  const validate = () => {
    const nextErrors: FormErrors = {};

    const numericFields: Array<keyof Pick<FormState, 'age' | 'weight' | 'height'>> = ['age', 'weight', 'height'];

    numericFields.forEach(field => {
      const value = form[field];
      if (!value.trim()) {
        nextErrors[field] = 'This field is required.';
        return;
      }

      const parsed = parseMetric(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        nextErrors[field] = 'Enter a valid number.';
      }
    });

    if (!form.gender) nextErrors.gender = 'Choose one option.';
    if (!form.activityLevel) nextErrors.activityLevel = 'Choose one option.';
    if (!form.goal) nextErrors.goal = 'Choose one option.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onCalculate = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      age: Math.round(parseMetric(form.age)),
      weight: parseMetric(form.weight),
      height: parseMetric(form.height),
      gender: form.gender as Gender,
      activityLevel: form.activityLevel as ActivityLevel,
      goal: form.goal as GoalType,
    };

    const calculation = calculateDailyCalories(payload);

    const profile: OnboardingProfile = {
      ...payload,
      dailyCalorieGoal: calculation.dailyCalories,
      isOnboardingComplete: true,
    };

    await saveUserProfile(profile);
    setResultCalories(calculation.dailyCalories);
    setResultText(calculation.explanation);
    setLoading(false);

    setTimeout(() => {
      router.replace('/(tabs)');
    }, 450);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.title}>Let&apos;s calculate your daily calorie target</Text>
        <Text style={styles.subtitle}>
          Answer a few quick questions and we&apos;ll personalize your nutrition goal before you enter the app.
        </Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Your details</Text>
        <InputField
          label="Age"
          placeholder="e.g. 29"
          keyboardType="number-pad"
          value={form.age}
          onChangeText={value => setForm(prev => ({ ...prev, age: value }))}
          error={errors.age}
        />
        <InputField
          label="Weight (kg)"
          placeholder="e.g. 72.5"
          keyboardType="decimal-pad"
          value={form.weight}
          onChangeText={value => setForm(prev => ({ ...prev, weight: value }))}
          error={errors.weight}
        />
        <InputField
          label="Height (cm)"
          placeholder="e.g. 175"
          keyboardType="number-pad"
          value={form.height}
          onChangeText={value => setForm(prev => ({ ...prev, height: value }))}
          error={errors.height}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.optionsGrid}>
          {genderOptions.map(option => (
            <SelectOption
              key={option.value}
              label={option.label}
              description={option.description}
              selected={form.gender === option.value}
              onPress={() => setForm(prev => ({ ...prev, gender: option.value }))}
            />
          ))}
        </View>
        {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Activity level</Text>
        <View style={styles.optionsColumn}>
          {activityOptions.map(option => (
            <SelectOption
              key={option.value}
              label={option.label}
              description={option.description}
              selected={form.activityLevel === option.value}
              onPress={() => setForm(prev => ({ ...prev, activityLevel: option.value }))}
            />
          ))}
        </View>
        {errors.activityLevel ? <Text style={styles.error}>{errors.activityLevel}</Text> : null}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Goal</Text>
        <View style={styles.optionsColumn}>
          {goalOptions.map(option => (
            <SelectOption
              key={option.value}
              label={option.label}
              description={option.description}
              selected={form.goal === option.value}
              onPress={() => setForm(prev => ({ ...prev, goal: option.value }))}
            />
          ))}
        </View>
        {errors.goal ? <Text style={styles.error}>{errors.goal}</Text> : null}
      </Card>

      <Card style={styles.resultCard}>
        <Text style={styles.sectionTitle}>Your target</Text>
        {resultCalories ? <Text style={styles.resultCalories}>{resultCalories} kcal/day</Text> : <Text style={styles.pendingText}>We&apos;ll show your personalized target here.</Text>}
        <Text style={styles.resultDescription}>
          {resultText ?? 'Your result includes your BMR, activity level, and a goal-based calorie adjustment.'}
        </Text>
      </Card>

      <PrimaryButton title="Calculate my calories" onPress={onCalculate} loading={loading} disabled={!canSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  heroCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#0E1A35',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.title,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    color: '#BDD0F2',
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionsColumn: {
    gap: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: '#FCA5A5',
  },
  resultCard: {
    backgroundColor: '#101B33',
  },
  resultCalories: {
    ...typography.title,
    color: palette.primary,
    fontSize: 34,
  },
  pendingText: {
    ...typography.body,
    color: '#D7E5FF',
  },
  resultDescription: {
    ...typography.body,
    color: '#BDD0F2',
  },
});
