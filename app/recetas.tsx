import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, spacing, typography } from '@/constants/design-system';

const recipes = [
  { name: 'Pollo con arroz integral', detail: '520 kcal · 38g proteína · 62g carbohidratos' },
  { name: 'Ensalada de quinoa y atún', detail: '430 kcal · 31g proteína · 41g carbohidratos' },
  { name: 'Omelette de verduras', detail: '360 kcal · 24g proteína · 18g carbohidratos' },
];

export default function RecetasScreen() {
  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header title="Recetas saludables" subtitle="Ideas rápidas con buen balance de macros para tu objetivo diario." />

      <View style={styles.list}>
        {recipes.map(recipe => (
          <Card key={recipe.name}>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
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
  content: { padding: spacing.md, gap: spacing.md },
  list: { gap: spacing.sm },
  recipeTitle: { ...typography.subtitle, fontSize: 17 },
  recipeDetail: { ...typography.body },
});
