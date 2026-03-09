import { FlatList, StyleSheet, Text, View } from 'react-native';

const recipes = ['Pollo con arroz', 'Ensalada de quinoa', 'Omelette de verduras'];

export default function RecetasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas saludables</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
  },
});
