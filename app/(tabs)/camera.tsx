import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useMemo, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { LoadingDots } from '@/components/ui/loading-dots';
import { palette, spacing, typography } from '@/constants/design-system';
import { addMealToHistory, toNumber } from '@/libreria/meal-history';

type FoodMetrics = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DetectedFood = FoodMetrics & {
  name: string;
  estimatedGrams: number;
  grams: number;
  baseMetrics: FoodMetrics;
};

const DEFAULT_PORTION_GRAMS = 100;

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

const parseFoodsFromText = (rawText: string): DetectedFood[] =>
  rawText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const cleaned = line.replace(/^[-•*]\s*/, '');
      const nameMatch = cleaned.match(/^[^:|-]+/);
      const caloriesMatch = cleaned.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
      const proteinMatch = cleaned.match(/(?:prote[ií]na|protein|p)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
      const carbsMatch = cleaned.match(/(?:carbohidratos|carbs?|c)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
      const fatMatch = cleaned.match(/(?:grasas?|fat|g)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
      const gramsMatch = cleaned.match(/(\d+(?:[.,]\d+)?)\s*g(?:ramos)?/i);

      if (!nameMatch || !caloriesMatch) return null;
      return buildDetectedFood({
        name: nameMatch[0].trim(),
        estimatedGrams: toNumber(gramsMatch?.[1]?.replace(',', '.')),
        metrics: {
          calories: toNumber(caloriesMatch[1]?.replace(',', '.')),
          protein: toNumber(proteinMatch?.[1]?.replace(',', '.')),
          carbs: toNumber(carbsMatch?.[1]?.replace(',', '.')),
          fat: toNumber(fatMatch?.[1]?.replace(',', '.')),
        },
      });
    })
    .filter((food): food is DetectedFood => Boolean(food));

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [foods, setFoods] = useState<DetectedFood[]>([]);

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

  if (!permission?.granted) {
    return (
      <FadeInView style={styles.permissionContainer}>
        <Card style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Activa la cámara</Text>
          <Text style={styles.permissionBody}>Necesitamos acceso para analizar tu plato y estimar calorías + macros.</Text>
          <AppButton title="Dar permiso" onPress={requestPermission} />
        </Card>
      </FadeInView>
    );
  }

  const saveMealToHistory = async () => {
    if (!foods.length) return;
    setSaving(true);
    try {
      await addMealToHistory({
        imageUri: capturedImageUri,
        foods,
        totals,
        notes: resultado,
        source: 'camera',
      });
      Speech.speak('Comida guardada en tu historial', { language: 'es' });
      Alert.alert('Guardado', 'La comida se guardó en el historial correctamente.');
    } catch (error) {
      console.log('❌ Error guardando historial:', error);
      Alert.alert('Error', 'No se pudo guardar la comida en el historial.');
    } finally {
      setSaving(false);
    }
  };

  const tomarFoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setResultado(null);
    setFoods([]);

    const foto = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
    setCapturedImageUri(foto.uri);
    const reducida = await ImageManipulator.manipulateAsync(foto.uri, [{ resize: { width: 800 } }], { base64: true });

    try {
      const res = await fetch('http://192.168.1.13:3001/ia/analizar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/jpeg;base64,${reducida.base64}` }),
      });
      const data = await res.json();
      const summary = data.respuestaIA ?? data.resumen ?? null;
      const apiFoods = Array.isArray(data.alimentos)
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
      const parsedFromText = typeof summary === 'string' ? parseFoodsFromText(summary) : [];
      setFoods(apiFoods.length ? apiFoods : parsedFromText);
      setResultado(summary || 'Análisis completado.');
      Speech.speak(summary || 'Análisis completado', { language: 'es' });
    } catch (error) {
      console.log('❌ Error IA imagen:', error);
      Speech.speak('Ocurrió un error analizando la imagen', { language: 'es' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Escaneo inteligente" subtitle="Fotografía tu plato y recibe un análisis nutricional instantáneo." />
        <View style={styles.cameraWrap}><CameraView ref={cameraRef} style={styles.camera} /></View>

        <Card>
          <Text style={styles.sectionTitle}>Análisis por foto</Text>
          <Text style={styles.sectionBody}>Usa buena iluminación para mayor precisión.</Text>
          {loading && <LoadingDots label="Analizando imagen..." />}
          <AppButton title="Tomar foto" onPress={tomarFoto} loading={loading} />
          <AppButton title="Volver" variant="ghost" onPress={() => router.back()} />
        </Card>

        {capturedImageUri && <Card><Text style={styles.sectionTitle}>Vista previa</Text><Image source={{ uri: capturedImageUri }} style={styles.previewImage} /></Card>}

        {!!foods.length && (
          <>
            <Card style={styles.foodListCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total: {Math.round(totals.calories)} kcal</Text>
                <Text style={styles.totalSubText}>P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · G {Math.round(totals.fat)}g</Text>
              </View>
              <Text style={styles.sectionBody}>Los gramos se estiman automáticamente con IA y puedes ajustarlos para recalcular macros y calorías al instante.</Text>
              <AppButton title="Guardar comida en historial" onPress={saveMealToHistory} loading={saving} />
            </Card>

            {foods.map((food, index) => (
              <Card key={`${food.name}-${index}`} style={styles.foodItemCard}>
                <View style={styles.foodRow}>
                  <MaterialCommunityIcons name="food-apple" size={16} color={palette.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.metric}>⚖️ Peso estimado: {Math.round(food.estimatedGrams)} g</Text>
                    <Text style={styles.metric}>Ajustar gramos</Text>
                    <AppInput
                      keyboardType="numeric"
                      value={food.grams ? String(Math.round(food.grams)) : ''}
                      onChangeText={value => updateFoodGrams(index, value)}
                      placeholder="Ej: 120"
                    />
                    <Text style={styles.metric}>🔥 {Math.round(food.calories)} kcal</Text>
                    <Text style={styles.metric}>💪 {Math.round(food.protein)}g · 🍞 {Math.round(food.carbs)}g · 🥑 {Math.round(food.fat)}g</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {resultado && <Card><Text style={styles.sectionTitle}>Resultado IA</Text><Text style={styles.result}>{resultado}</Text></Card>}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  cameraWrap: { height: 260, overflow: 'hidden', borderRadius: 22, borderWidth: 1, borderColor: palette.border },
  camera: { flex: 1 },
  sectionTitle: { ...typography.subtitle },
  sectionBody: { ...typography.body },
  previewImage: { width: '100%', height: 220, borderRadius: 14, marginTop: spacing.sm },
  foodListCard: { gap: spacing.sm },
  foodItemCard: { gap: spacing.xs },
  foodRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  foodName: { ...typography.body, color: palette.textPrimary },
  metric: { ...typography.caption },
  totalRow: { gap: 2 },
  totalText: { ...typography.body, color: palette.textPrimary },
  totalSubText: { ...typography.caption },
  result: { ...typography.body, color: palette.textPrimary, fontWeight: '600' },
  permissionContainer: { flex: 1, justifyContent: 'center', padding: spacing.md, backgroundColor: palette.background },
  permissionCard: { gap: spacing.md },
  permissionTitle: { ...typography.subtitle },
  permissionBody: { ...typography.body },
});
