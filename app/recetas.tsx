import { StyleSheet, Text, View } from 'react-native';

const recipes = ['Pollo con arroz', 'Ensalada de quinoa', 'Omelette de verduras'];

export default function RecetasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas saludables</Text>

      {recipes.map(recipe => (
        <Text key={recipe} style={styles.recipeItem}>
          • {recipe}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  recipeItem: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
});
