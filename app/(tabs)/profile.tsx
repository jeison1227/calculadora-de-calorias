import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { calculateDailyCalories } from '@/utils/calorieCalculator';
import { UserProfile, defaultUserProfile, getUserProfile, saveUserProfile } from '@/libreria/user-profile';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
] as const;

const activityLevels = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
] as const;

const goals = [
  { label: 'Lose weight', value: 'lose_weight' },
  { label: 'Maintain', value: 'maintain' },
  { label: 'Gain weight', value: 'gain_weight' },
] as const;

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const completion = useMemo(() => {
    const fields = [profile.age, profile.height, profile.weight, profile.dailyCalorieGoal];
    const valid = fields.filter(value => value > 0).length;
    return Math.round((valid / fields.length) * 100);
  }, [profile]);

  const updateNumber = (field: keyof Pick<UserProfile, 'weight' | 'height' | 'age' | 'dailyCalorieGoal'>, value: string) => {
    const parsed = Number(value.replace(',', '.'));
    setProfile(prev => ({ ...prev, [field]: Number.isFinite(parsed) ? parsed : 0 }));
  };

  const recalculateCalories = () => {
    const calculation = calculateDailyCalories({
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
    });

    setProfile(prev => ({ ...prev, dailyCalorieGoal: calculation.dailyCalories }));
  };

  const onSave = async () => {
    setSaving(true);
    await saveUserProfile({ ...profile, isOnboardingComplete: true });
    setSaving(false);
    Alert.alert('Saved', 'Your profile and calorie goal were updated.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header title="Profile" subtitle="Configura tus métricas personales y objetivo para personalizar el asistente de nutrición." />

      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>
          <Text style={styles.progress}>{completion}% complete</Text>
        </View>

        <Text style={styles.label}>Weight (kg)</Text>
        <AppInput value={String(profile.weight)} keyboardType="numeric" onChangeText={value => updateNumber('weight', value)} />

        <Text style={styles.label}>Height (cm)</Text>
        <AppInput value={String(profile.height)} keyboardType="numeric" onChangeText={value => updateNumber('height', value)} />

        <Text style={styles.label}>Age</Text>
        <AppInput value={String(profile.age)} keyboardType="numeric" onChangeText={value => updateNumber('age', value)} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.optionsWrap}>
          {genderOptions.map(option => {
            const selected = profile.gender === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setProfile(prev => ({ ...prev, gender: option.value }))}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Activity level</Text>
        <View style={styles.optionsWrap}>
          {activityLevels.map(level => {
            const selected = profile.activityLevel === level.value;
            return (
              <Pressable
                key={level.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setProfile(prev => ({ ...prev, activityLevel: level.value }))}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{level.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Goal</Text>
        <View style={styles.optionsWrap}>
          {goals.map(goal => {
            const selected = profile.goal === goal.value;
            return (
              <Pressable
                key={goal.value}
                style={[styles.goalCard, selected && styles.goalCardSelected]}
                onPress={() => setProfile(prev => ({ ...prev, goal: goal.value }))}>
                <Text style={[styles.goalTitle, selected && styles.goalTitleSelected]}>{goal.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <AppButton title="Recalculate calories" variant="ghost" onPress={recalculateCalories} />

        <Text style={styles.label}>Daily calorie goal</Text>
        <AppInput
          value={String(profile.dailyCalorieGoal)}
          keyboardType="numeric"
          onChangeText={value => updateNumber('dailyCalorieGoal', value)}
        />

        <AppButton title="Save profile" onPress={onSave} loading={saving} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.subtitle, fontSize: 20 },
  progress: {
    ...typography.caption,
    color: palette.primary,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  label: { ...typography.caption, color: '#D9E6FF' },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#101C35',
  },
  chipSelected: { borderColor: palette.primary, backgroundColor: '#163A2B' },
  chipText: { ...typography.caption, color: palette.textPrimary },
  chipTextSelected: { color: '#D8FFE8' },
  goalCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: '#101C35',
  },
  goalCardSelected: { borderColor: palette.primary, backgroundColor: '#17392C' },
  goalTitle: { ...typography.body, color: palette.textPrimary },
  goalTitleSelected: { color: '#D8FFE8', fontWeight: '700' },
});
