import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { palette, radius, spacing, typography } from '@/constants/design-system';

const recipes = [
  {
    name: 'Bowl de salmón & quinoa',
    calories: 520,
    ingredients: ['120g salmón', '100g quinoa cocida', 'Espinaca', 'Tomate cherry', 'Aceite de oliva'],
    steps: ['Cocina la quinoa 12 minutos.', 'Sella el salmón 3 minutos por lado.', 'Mezcla con vegetales y aliña.'],
  },
  {
    name: 'Wrap proteico de pollo',
    calories: 430,
    ingredients: ['150g pollo a la plancha', 'Tortilla integral', 'Yogur griego', 'Lechuga', 'Pepino'],
    steps: ['Corta el pollo en tiras.', 'Unta yogur en la tortilla.', 'Agrega vegetales, enrolla y sirve.'],
  },
  {
    name: 'Omelette fit con aguacate',
    calories: 360,
    ingredients: ['2 huevos + 3 claras', 'Champiñones', 'Espinaca', '1/4 aguacate', 'Pan integral'],
    steps: ['Saltea los vegetales.', 'Añade huevos batidos y cocina.', 'Sirve con aguacate y pan tostado.'],
  },
];

export default function RecetasScreen() {
  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header title="Healthy Recipes" subtitle="Recetas rápidas con calorías por porción, ingredientes y pasos claros." />

        {recipes.map(recipe => (
          <Card key={recipe.name} style={styles.recipeCard}>
            <View style={styles.topRow}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.caloriePill}>
                <MaterialCommunityIcons name="fire" size={14} color={palette.accent} />
                <Text style={styles.calorieText}>{recipe.calories} kcal</Text>
              </View>
            </View>

            <Text style={styles.blockTitle}>Ingredientes</Text>
            <View style={styles.blockList}>
              {recipe.ingredients.map(item => (
                <Text key={item} style={styles.listItem}>• {item}</Text>
              ))}
            </View>

            <Text style={styles.blockTitle}>Preparación</Text>
            <View style={styles.blockList}>
              {recipe.steps.map((item, index) => (
                <Text key={item} style={styles.listItem}>{index + 1}. {item}</Text>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  recipeCard: { gap: spacing.xs, backgroundColor: '#101E39' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  recipeName: { ...typography.subtitle, fontSize: 20, flex: 1 },
  caloriePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: '#1A2948',
  },
  calorieText: { ...typography.caption, color: palette.textPrimary },
  blockTitle: { ...typography.body, color: palette.primary, fontWeight: '700' },
  blockList: { gap: 4 },
  listItem: { ...typography.caption, color: '#DBE7FF' },
});
