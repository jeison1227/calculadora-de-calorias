
import * as Speech from 'expo-speech';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ManualFoodScreen() {
  const [food, setFood] = useState('');
  const [grams, setGrams] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calcularManual = async () => {
    if (!food || !grams) {
      Speech.speak('Debes ingresar el alimento y el peso', {
        language: 'es',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'http://192.168.1.13:3001/ia/calcular-manual',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alimento: food,
            gramos: Number(grams),
          }),
        }
      );

      const data = await res.json();

      setResult(data.respuestaIA);

      if (data?.respuestaIA) {
        Speech.speak(data.respuestaIA, { language: 'es' });
      }
    } catch (error) {
      console.log('❌ Error cálculo manual:', error);
      Speech.speak(
        'Hubo un error calculando las calorías',
        { language: 'es' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✍️ Cálculo manual</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: arroz cocido"
        value={food}
        onChangeText={setFood}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso en gramos (ej: 150)"
        keyboardType="numeric"
        value={grams}
        onChangeText={setGrams}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={calcularManual}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Calculando...' : 'Calcular calorías'}
        </Text>
      </TouchableOpacity>

      {result && (
        <Text style={styles.resultado}>{result}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultado: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
