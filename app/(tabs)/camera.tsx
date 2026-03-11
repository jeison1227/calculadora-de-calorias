import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useMemo, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { LoadingDots } from '@/components/ui/loading-dots';
import { palette, spacing, typography } from '@/constants/design-system';

type DetectedFood = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const MEAL_HISTORY_KEY = 'mealHistory';

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseFoodsFromText = (rawText: string): DetectedFood[] => {
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines
    .map(line => {
      const lineWithoutBullet = line.replace(/^[-•*]\s*/, '');
      const nameMatch = lineWithoutBullet.match(/^[^:|-]+/);
      const caloriesMatch = lineWithoutBullet.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
      const proteinMatch = lineWithoutBullet.match(/(?:prote[ií]na|protein|p)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
      const carbsMatch = lineWithoutBullet.match(/(?:carbohidratos|carbs?|c)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
      const fatMatch = lineWithoutBullet.match(/(?:grasas?|fat|g)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);

      if (!nameMatch || !caloriesMatch) return null;

      return {
        name: nameMatch[0].trim(),
        calories: toNumber(caloriesMatch[1]?.replace(',', '.')),
        protein: toNumber(proteinMatch?.[1]?.replace(',', '.')),
        carbs: toNumber(carbsMatch?.[1]?.replace(',', '.')),
        fat: toNumber(fatMatch?.[1]?.replace(',', '.')),
      };
    })
    .filter((food): food is DetectedFood => Boolean(food));
};

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

  if (!permission?.granted) {
    return (
      <FadeInView style={styles.permissionContainer}>
        <View style={styles.permissionContainer}>
          <Card style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Permiso de cámara</Text>
            <Text style={styles.permissionBody}>Necesitamos acceso para analizar tu comida desde una foto.</Text>
            <AppButton title="Dar permiso" onPress={requestPermission} />
          </Card>
        </View>
      </FadeInView>
    );
  }

  const saveMealToHistory = async () => {
    if (!foods.length) return;
    setSaving(true);

    try {
      const existing = await AsyncStorage.getItem(MEAL_HISTORY_KEY);
      const parsedHistory = existing ? JSON.parse(existing) : [];
      const nextHistory = [
        {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          imageUri: capturedImageUri,
          foods,
          totals,
          notes: resultado,
        },
        ...(Array.isArray(parsedHistory) ? parsedHistory : []),
      ];

      await AsyncStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(nextHistory));
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
    const reducida = await ImageManipulator.manipulateAsync(
      foto.uri,
      [{ resize: { width: 800 } }],
      { base64: true }
    );

    try {
      const res = await fetch('http://192.168.1.13:3001/ia/analizar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/jpeg;base64,${reducida.base64}` }),
      });

      const data = await res.json();
      const summary = data.respuestaIA ?? data.resumen ?? null;
      const apiFoods = Array.isArray(data.alimentos)
        ? data.alimentos.map((item: any) => ({
            name: item.nombre ?? item.name ?? 'Alimento detectado',
            calories: toNumber(item.calorias ?? item.calories),
            protein: toNumber(item.proteina ?? item.protein),
            carbs: toNumber(item.carbohidratos ?? item.carbs),
            fat: toNumber(item.grasa ?? item.fat),
          }))
        : [];

      const parsedFromText = typeof summary === 'string' ? parseFoodsFromText(summary) : [];
      const normalizedFoods = apiFoods.length ? apiFoods : parsedFromText;

      setFoods(normalizedFoods);
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
        <View style={styles.cameraWrap}>
          <CameraView ref={cameraRef} style={styles.camera} />
        </View>

        <Card>
          <Text style={styles.overlayTitle}>Análisis por foto</Text>
          <Text style={styles.overlayBody}>Toma una imagen nítida del plato para estimar calorías y macros.</Text>
          {loading && <LoadingDots label="Analizando imagen..." />}
          <AppButton title="Tomar foto" onPress={tomarFoto} loading={loading} />
          <AppButton title="Volver" variant="ghost" onPress={() => router.back()} />
        </Card>

        {capturedImageUri && (
          <Card>
            <Text style={styles.sectionTitle}>Vista previa</Text>
            <Image source={{ uri: capturedImageUri }} style={styles.previewImage} />
          </Card>
        )}

        {!!foods.length && (
          <Card style={styles.foodListCard}>
            <Text style={styles.sectionTitle}>Alimentos detectados</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Calorías totales: {Math.round(totals.calories)} kcal</Text>
              <Text style={styles.totalSubText}>
                P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · G {Math.round(totals.fat)}g
              </Text>
            </View>

            {foods.map((food, index) => (
              <Card key={`${food.name}-${index}`} style={styles.foodCard}>
                <Text style={styles.foodName}>{food.name}</Text>
                <View style={styles.metricsRow}>
                  <Text style={styles.metric}>🔥 {Math.round(food.calories)} kcal</Text>
                  <Text style={styles.metric}>💪 {Math.round(food.protein)}g</Text>
                  <Text style={styles.metric}>🍞 {Math.round(food.carbs)}g</Text>
                  <Text style={styles.metric}>🥑 {Math.round(food.fat)}g</Text>
                </View>
              </Card>
            ))}

            <AppButton title="Guardar comida en historial" onPress={saveMealToHistory} loading={saving} />
          </Card>
        )}

        {resultado && (
          <Card>
            <Text style={styles.sectionTitle}>Resultado IA</Text>
            <Text style={styles.result}>{resultado}</Text>
          </Card>
        )}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  cameraWrap: {
    height: 260,
    overflow: 'hidden',
    borderRadius: 20,
  },
  camera: { flex: 1 },
  overlayTitle: { ...typography.subtitle },
  overlayBody: { ...typography.body },
  sectionTitle: { ...typography.subtitle },
  result: { ...typography.body, color: palette.textPrimary, fontWeight: '600' },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  foodListCard: { gap: spacing.sm },
  foodCard: { gap: spacing.xs, backgroundColor: '#F8FAFF' },
  foodName: { ...typography.body, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: { ...typography.caption, color: palette.textSecondary },
  totalRow: { gap: 4 },
  totalText: { ...typography.body, fontWeight: '700' },
  totalSubText: { ...typography.caption, color: palette.textSecondary },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: palette.background,
  },
  permissionCard: { gap: spacing.md },
  permissionTitle: { ...typography.subtitle },
  permissionBody: { ...typography.body },
});
