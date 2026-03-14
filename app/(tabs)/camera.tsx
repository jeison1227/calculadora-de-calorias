import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Speech from 'expo-speech';
import { useMemo, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { LoadingDots } from '@/components/ui/loading-dots';
import { palette, radius, spacing, typography } from '@/constants/design-system';
import { addMealToHistory, toNumber } from '@/libreria/meal-history';

type FoodMetrics = { calories: number; protein: number; carbs: number; fat: number };
type DetectedFood = FoodMetrics & { name: string; estimatedGrams: number; grams: number; baseMetrics: FoodMetrics };

const DEFAULT_PORTION_GRAMS = 100;
const ANALYZER_URL = process.env.EXPO_PUBLIC_ANALYZER_URL ?? 'http://192.168.1.13:3001/ia/analizar-imagen';

const scaleMetricsByGrams = (metrics: FoodMetrics, grams: number, baseGrams: number): FoodMetrics => {
  if (!baseGrams) return metrics;
  const ratio = grams / baseGrams;
  return {
    calories: metrics.calories * ratio,
    protein: metrics.protein * ratio,
    carbs: metrics.carbs * ratio,
    fat: metrics.fat * ratio,
  };
};

const buildDetectedFood = (input: { name: string; metrics: FoodMetrics; estimatedGrams: number }): DetectedFood => {
  const safeEstimatedGrams = Math.max(1, toNumber(input.estimatedGrams) || DEFAULT_PORTION_GRAMS);
  return {
    name: input.name,
    estimatedGrams: safeEstimatedGrams,
    grams: safeEstimatedGrams,
    baseMetrics: input.metrics,
    ...input.metrics,
  };
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [foods, setFoods] = useState<DetectedFood[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      foods.reduce(
        (acc, food) => ({
          calories: acc.calories + food.calories,
          protein: acc.protein + food.protein,
          carbs: acc.carbs + food.carbs,
          fat: acc.fat + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [foods]
  );

  const updateFoodGrams = (index: number, rawGrams: string) => {
    const nextGrams = Math.max(0, toNumber(rawGrams.replace(',', '.')));
    setFoods(prevFoods =>
      prevFoods.map((food, foodIndex) => {
        if (foodIndex !== index) return food;
        const scaled = scaleMetricsByGrams(food.baseMetrics, nextGrams, food.estimatedGrams);
        return { ...food, grams: nextGrams, ...scaled };
      })
    );
  };

  const analyzePhoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setAiSummary(null);
    setFoods([]);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
      setCapturedImageUri(photo.uri);
      const resized = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 900 } }], { base64: true });

      const res = await fetch(ANALYZER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/jpeg;base64,${resized.base64}` }),
      });

      const data = await res.json();
      const summary = data.respuestaIA ?? data.resumen ?? 'Análisis completado';
      const detected = Array.isArray(data.alimentos)
        ? data.alimentos.map((item: any) =>
            buildDetectedFood({
              name: item.nombre ?? item.name ?? 'Alimento detectado',
              estimatedGrams: item.gramosEstimados ?? item.estimatedGrams ?? item.gramos ?? item.weightGrams,
              metrics: {
                calories: toNumber(item.calorias ?? item.calories),
                protein: toNumber(item.proteina ?? item.protein),
                carbs: toNumber(item.carbohidratos ?? item.carbs),
                fat: toNumber(item.grasa ?? item.fat),
              },
            })
          )
        : [];

      setFoods(detected);
      setAiSummary(summary);
      Speech.speak('Análisis finalizado', { language: 'es' });
    } catch (error) {
      console.log('❌ AI image error:', error);
      Alert.alert('Error', 'No se pudo analizar la imagen. Revisa la conexión con el servicio IA.');
      Speech.speak('No se pudo completar el análisis', { language: 'es' });
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async () => {
    if (!foods.length) return;
    setSaving(true);
    try {
      await addMealToHistory({ imageUri: capturedImageUri, foods, totals, notes: aiSummary, source: 'camera' });
      Alert.alert('Saved', 'Meal added to history.');
    } finally {
      setSaving(false);
    }
  };

  if (!permission?.granted) {
    return (
      <FadeInView style={styles.permissionContainer}>
        <Card style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Enable Camera</Text>
          <Text style={styles.permissionBody}>Camera access is needed for multi-food detection and portion-size estimation.</Text>
          <AppButton title="Grant permission" onPress={requestPermission} />
        </Card>
      </FadeInView>
    );
  }

  return (
    <FadeInView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="AI Food Scanner" subtitle="Detecta múltiples alimentos, estima porciones y ajusta el peso manualmente." />

        <View style={styles.cameraWrap}><CameraView ref={cameraRef} style={styles.camera} /></View>

        <Card>
          <Text style={styles.sectionTitle}>Smart analysis</Text>
          <Text style={styles.sectionBody}>Captura tu plato para obtener calorías y macros por cada alimento.</Text>
          {loading && <LoadingDots label="AI analyzing your food..." />}
          <AppButton title="Analyze food" onPress={analyzePhoto} loading={loading} />
        </Card>

        {capturedImageUri && (
          <Card>
            <Text style={styles.sectionTitle}>Image preview</Text>
            <Image source={{ uri: capturedImageUri }} style={styles.previewImage} />
          </Card>
        )}

        {!!foods.length && (
          <Card>
            <View style={styles.totalPill}>
              <Text style={styles.totalText}>{Math.round(totals.calories)} kcal</Text>
              <Text style={styles.totalSubText}>P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g</Text>
            </View>
            <AppButton title="Save meal" onPress={saveMeal} loading={saving} />

            {foods.map((food, index) => (
              <View key={`${food.name}-${index}`} style={styles.foodCard}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.metric}>Estimated portion: {Math.round(food.estimatedGrams)}g</Text>
                <AppInput
                  keyboardType="numeric"
                  value={food.grams ? String(Math.round(food.grams)) : ''}
                  onChangeText={value => updateFoodGrams(index, value)}
                  placeholder="Adjust grams"
                />
                <Text style={styles.metric}>Calories: {Math.round(food.calories)} kcal</Text>
                <Text style={styles.metric}>Protein {Math.round(food.protein)}g · Carbs {Math.round(food.carbs)}g · Fat {Math.round(food.fat)}g</Text>
              </View>
            ))}
          </Card>
        )}

        {aiSummary && (
          <Card>
            <Text style={styles.sectionTitle}>AI summary</Text>
            <Text style={styles.summary}>{aiSummary}</Text>
          </Card>
        )}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  cameraWrap: {
    height: 260,
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
  },
  camera: { flex: 1 },
  sectionTitle: { ...typography.subtitle },
  sectionBody: { ...typography.body },
  previewImage: { width: '100%', height: 220, borderRadius: radius.md, marginTop: spacing.sm },
  totalPill: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    backgroundColor: '#142747',
    padding: spacing.sm,
    gap: 2,
  },
  totalText: { ...typography.body, color: palette.primary, fontWeight: '800' },
  totalSubText: { ...typography.caption, color: '#D8E5FF' },
  foodCard: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: '#101E39',
    gap: 4,
  },
  foodName: { ...typography.body, color: palette.textPrimary, fontWeight: '700' },
  metric: { ...typography.caption },
  summary: { ...typography.body, color: palette.textPrimary },
  permissionContainer: { flex: 1, justifyContent: 'center', padding: spacing.md, backgroundColor: palette.background },
  permissionCard: { gap: spacing.md },
  permissionTitle: { ...typography.subtitle },
  permissionBody: { ...typography.body },
});
