import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { palette, radius, spacing, typography } from '@/constants/design-system';

type ActivityLevel = {
  label: string;
  value: string;
  description: string;
};

const activityLevels: ActivityLevel[] = [
  { label: 'Sedentario', value: 'sedentary', description: 'Poco o nada de ejercicio' },
  { label: 'Ligero', value: 'light', description: 'Ejercicio 1-3 días/semana' },
  { label: 'Moderado', value: 'moderate', description: 'Ejercicio 3-5 días/semana' },
  { label: 'Alto', value: 'active', description: 'Ejercicio 6-7 días/semana' },
  { label: 'Muy alto', value: 'very-active', description: 'Trabajo físico intenso o doble sesión' },
];

export default function ProfileScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('2000');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(activityLevels[2]);

  const completion = useMemo(() => {
    const fields = [age, height, weight, dailyCalorieGoal];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [age, height, weight, dailyCalorieGoal]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header
        title="Perfil"
        subtitle="Completa tus datos para personalizar tus recomendaciones de calorías y seguimiento diario."
      />

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Datos personales</Text>
          <View style={styles.progressBadge}>
            <MaterialCommunityIcons name="progress-check" size={14} color={palette.primary} />
            <Text style={styles.progressText}>{completion}% completo</Text>
          </View>
        </View>

        <Text style={styles.label}>Edad</Text>
        <AppInput
          placeholder="Ej: 29"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Altura (cm)</Text>
        <AppInput
          placeholder="Ej: 172"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <Text style={styles.label}>Peso (kg)</Text>
        <AppInput
          placeholder="Ej: 70"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Nivel de actividad</Text>
        <View style={styles.levelsWrap}>
          {activityLevels.map(level => {
            const selected = level.value === activityLevel.value;
            return (
              <Pressable
                key={level.value}
                style={[styles.levelOption, selected && styles.levelOptionSelected]}
                onPress={() => setActivityLevel(level)}>
                <Text style={[styles.levelLabel, selected && styles.levelLabelSelected]}>{level.label}</Text>
                <Text style={[styles.levelDescription, selected && styles.levelDescriptionSelected]}>
                  {level.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Meta diaria</Text>
        <Text style={styles.label}>Objetivo de calorías</Text>
        <AppInput
          placeholder="Ej: 2100"
          keyboardType="numeric"
          value={dailyCalorieGoal}
          onChangeText={setDailyCalorieGoal}
        />

        <View style={styles.goalHint}>
          <MaterialCommunityIcons name="fire" size={16} color={palette.accent} />
          <Text style={styles.goalHintText}>
            Tu meta actual: {dailyCalorieGoal || '0'} kcal • Nivel: {activityLevel.label}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.subtitle, fontSize: 20 },
  label: { ...typography.caption, marginTop: spacing.xs, color: '#D4E4FF' },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#132942',
  },
  progressText: { ...typography.caption, color: palette.primary },
  levelsWrap: { gap: spacing.sm },
  levelOption: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: palette.backgroundSoft,
    gap: 4,
  },
  levelOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: '#132942',
  },
  levelLabel: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  levelLabelSelected: {
    color: '#D3FFE4',
  },
  levelDescription: {
    ...typography.caption,
  },
  levelDescriptionSelected: {
    color: '#B8E8CA',
  },
  goalHint: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  goalHintText: {
    ...typography.body,
    color: palette.textSecondary,
  },
});
