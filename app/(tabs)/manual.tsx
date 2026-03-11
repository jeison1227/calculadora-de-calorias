import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { LoadingDots } from '@/components/ui/loading-dots';
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
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Header title="Registro manual" subtitle="Añade alimentos y obtén estimaciones precisas de calorías en segundos." />

        <Card>
          <View style={styles.chip}><MaterialCommunityIcons name="lightning-bolt" size={14} color={palette.primary} /><Text style={styles.chipText}>Rápido y preciso</Text></View>
          <Text style={styles.label}>Alimento</Text>
          <AppInput placeholder="Ej: arroz cocido" value={food} onChangeText={setFood} />
          <Text style={styles.label}>Cantidad</Text>
          <AppInput placeholder="Peso en gramos (ej: 150)" keyboardType="numeric" value={grams} onChangeText={setGrams} />
          {loading && <LoadingDots label="Analizando alimento..." />}
          <AppButton title="Calcular calorías" onPress={calcularManual} loading={loading} />
        </Card>

        {result && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Resultado IA</Text>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  chip: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: '#132942' },
  chipText: { ...typography.caption, color: palette.primary },
  label: { ...typography.caption, marginTop: spacing.xs, color: '#D4E4FF' },
  resultCard: { backgroundColor: '#10213B' },
  resultTitle: { ...typography.subtitle },
  resultText: { ...typography.body, color: palette.textPrimary },
});
