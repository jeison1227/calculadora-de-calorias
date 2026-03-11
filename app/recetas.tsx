import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, spacing, typography } from '@/constants/design-system';

const recipes = [
  { name: 'Bowl de pollo con arroz integral', detail: '520 kcal · 38g proteína · 62g carbohidratos' },
  { name: 'Quinoa con atún y aguacate', detail: '430 kcal · 31g proteína · 41g carbohidratos' },
  { name: 'Omelette de verduras + tostada', detail: '360 kcal · 24g proteína · 18g carbohidratos' },
];

export default function RecetasScreen() {
  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header title="Recetas saludables" subtitle="Comidas con buen balance de macros para mantener tu objetivo sin complicaciones." />

        <View style={styles.list}>
          {recipes.map(recipe => (
            <Card key={recipe.name}>
              <View style={styles.row}><MaterialCommunityIcons name="food-apple" size={16} color={palette.primary} /><Text style={styles.recipeTitle}>{recipe.name}</Text></View>
              <Text style={styles.recipeDetail}>{recipe.detail}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  recipeTitle: { ...typography.subtitle, fontSize: 18 },
  recipeDetail: { ...typography.body },
});
