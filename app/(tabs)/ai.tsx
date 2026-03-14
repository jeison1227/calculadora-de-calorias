import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { generateNutritionRecommendation, goalLabels, UserGoal } from '@/libreria/ai-nutrition';

const goals: UserGoal[] = ['lose_weight', 'maintain', 'gain_muscle'];

export default function AiNutritionScreen() {
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>('maintain');
  const [activeGoal, setActiveGoal] = useState<UserGoal>('maintain');

  const recommendation = useMemo(() => generateNutritionRecommendation(activeGoal), [activeGoal]);

  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header
          title="Nutrición IA"
          subtitle="Analiza tu objetivo y genera recomendaciones de comidas diarias y recetas saludables en segundos."
        />

        <Card style={styles.goalCard}>
          <Text style={styles.sectionTitle}>1) Selecciona tu objetivo</Text>
          <View style={styles.goalButtonsRow}>
            {goals.map(goal => {
              const isSelected = selectedGoal === goal;
              return (
                <AppButton
                  key={goal}
                  title={goalLabels[goal]}
                  variant={isSelected ? 'primary' : 'ghost'}
                  onPress={() => setSelectedGoal(goal)}
                />
              );
            })}
          </View>

          <AppButton title="Generar recomendación IA" onPress={() => setActiveGoal(selectedGoal)} />
        </Card>

        <Card style={styles.analysisCard}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>{recommendation.title}</Text>
            <MaterialCommunityIcons name="brain" size={18} color={palette.primary} />
          </View>
          <Text style={styles.analysisText}>{recommendation.analysis}</Text>

          <View style={styles.targetsRow}>
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>Calorías estimadas</Text>
              <Text style={styles.targetValue}>{recommendation.dailyCalories}</Text>
            </View>
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>Proteína recomendada</Text>
              <Text style={styles.targetValue}>{recommendation.proteinFocus}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>2) Sugerencias de comidas diarias</Text>
          <View style={styles.listWrap}>
            {recommendation.meals.map(item => (
              <View key={item.meal} style={styles.rowItem}>
                <Text style={styles.rowTitle}>{item.meal}</Text>
                <Text style={styles.rowDescription}>{item.suggestion}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>3) Recetas saludables</Text>
          <View style={styles.listWrap}>
            {recommendation.recipes.map(recipe => (
              <View key={recipe.name} style={styles.recipeItem}>
                <View style={styles.recipeTop}>
                  <Text style={styles.rowTitle}>{recipe.name}</Text>
                  <Text style={styles.recipeTime}>{recipe.prepTime}</Text>
                </View>
                <Text style={styles.rowDescription}>{recipe.benefits}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  goalCard: { gap: spacing.sm },
  goalButtonsRow: { gap: spacing.sm },
  sectionTitle: { ...typography.subtitle, fontSize: 19 },
  analysisCard: { backgroundColor: '#0E1A35', gap: spacing.sm },
  cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  cardTitle: { ...typography.subtitle, fontSize: 20, flex: 1 },
  analysisText: { ...typography.body, color: '#BDD0F2' },
  targetsRow: { flexDirection: 'row', gap: spacing.sm },
  targetPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#365B94',
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: '#142647',
    gap: 2,
  },
  targetLabel: { ...typography.caption, color: '#9CB4DC' },
  targetValue: { ...typography.body, color: palette.textPrimary, fontWeight: '700' },
  listWrap: { marginTop: spacing.xs, gap: spacing.sm },
  rowItem: {
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    paddingBottom: spacing.sm,
  },
  recipeItem: {
    gap: 4,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: '#122340',
  },
  recipeTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm, alignItems: 'center' },
  recipeTime: {
    ...typography.caption,
    color: palette.primary,
    borderWidth: 1,
    borderColor: '#285E42',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rowTitle: { ...typography.body, color: palette.textPrimary, fontWeight: '700' },
  rowDescription: { ...typography.body, color: '#AEC1E5' },
});
