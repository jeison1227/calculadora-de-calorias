import * as Speech from 'expo-speech';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { palette, radius, spacing, typography } from '@/constants/design-system';

export default function ManualFoodScreen() {
  const [food, setFood] = useState('');
  const [grams, setGrams] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calcularManual = async () => {
    if (!food || !grams) {
      Speech.speak('Debes ingresar el alimento y el peso', { language: 'es' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.13:3001/ia/calcular-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento: food, gramos: Number(grams) }),
      });
      const data = await res.json();
      setResult(data.respuestaIA);
      if (data?.respuestaIA) Speech.speak(data.respuestaIA, { language: 'es' });
    } catch (error) {
      console.log('❌ Error cálculo manual:', error);
      Speech.speak('Hubo un error calculando las calorías', { language: 'es' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cálculo manual</Text>
      <Text style={styles.subtitle}>Consulta calorías por alimento indicando el peso exacto.</Text>

      <Card>
        <Text style={styles.label}>Alimento</Text>
        <TextInput style={styles.input} placeholder="Ej: arroz cocido" value={food} onChangeText={setFood} placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Cantidad</Text>
        <TextInput style={styles.input} placeholder="Peso en gramos (ej: 150)" keyboardType="numeric" value={grams} onChangeText={setGrams} placeholderTextColor="#94A3B8" />

        <AppButton title="Calcular calorías" onPress={calcularManual} loading={loading} />
      </Card>

      {result && (
        <Card>
          <Text style={styles.resultTitle}>Resultado</Text>
          <Text style={styles.resultText}>{result}</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  label: { ...typography.label, marginTop: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: palette.textPrimary,
  },
  resultTitle: { ...typography.subtitle },
  resultText: { ...typography.body, color: palette.textPrimary },
});
