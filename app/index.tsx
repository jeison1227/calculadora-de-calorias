import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const actions = [
  { label: '📊 Calcular calorías' },
  { label: '🥗 Plan diario' },
  { label: '🍽 Recetas', onPress: () => router.push('/recetas') },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de calorías</Text>

      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          style={styles.button}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    backgroundColor: '#2f7dff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
