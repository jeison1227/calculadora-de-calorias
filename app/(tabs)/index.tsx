import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { AppInput } from '@/components/ui/input';
import { palette, radius, spacing, typography } from '@/constants/design-system';

type Goal = 'bajar' | 'subir' | 'mantener';
type ActivityLevel = 'sedentaria' | 'baja' | 'moderada' | 'alta';

export default function HomeScreen() {
  const [step, setStep] = useState<'welcome' | 'goal' | 'data'>('welcome');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [activity, setActivity] = useState<ActivityLevel | null>(null);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState<number | null>(null);
  const [macros, setMacros] = useState<{ protein: number; carbs: number; fats: number } | null>(null);

  const saludar = () => {
    if (!name.trim()) return;
    Speech.speak(`Hola ${name}, bienvenido a tu calculadora inteligente`, {
      language: 'es',
    });
  };

  const calcularCalorias = async () => {
    if (!age || !height || !weight || !activity || !goal) {
      Speech.speak('Completa todos los datos primero', { language: 'es' });
      return;
    }

    const tmb = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
    const factores: Record<ActivityLevel, number> = {
      sedentaria: 1.2,
      baja: 1.375,
      moderada: 1.55,
      alta: 1.725,
    };

    let calorias = tmb * factores[activity];
    if (goal === 'bajar') calorias *= 0.8;
    if (goal === 'subir') calorias *= 1.15;

    const resultado = Math.round(calorias);
    const macrosCalc = {
      protein: Math.round((resultado * 0.3) / 4),
      carbs: Math.round((resultado * 0.4) / 4),
      fats: Math.round((resultado * 0.3) / 9),
    };

    setCalories(resultado);
    setMacros(macrosCalc);

    await AsyncStorage.setItem(
      'perfilUsuario',
      JSON.stringify({ name, goal, activity, calories: resultado, macros: macrosCalc })
    );

    Speech.speak(`Tu consumo diario recomendado es de ${resultado} calorías`, {
      language: 'es',
    });
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      const data = await AsyncStorage.getItem('perfilUsuario');
      if (!data) return;
      const perfil = JSON.parse(data);
      setName(perfil.name || '');
      setGoal(perfil.goal || null);
      setActivity(perfil.activity || null);
      setCalories(perfil.calories || null);
      setMacros(perfil.macros || null);
      setStep('data');
    };

    cargarPerfil();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header
        title="Calorie Pro"
        subtitle="Planifica tus calorías y macronutrientes con una experiencia clara y moderna."
      />

      {step === 'welcome' && (
        <Card>
          <Text style={styles.cardTitle}>Comencemos</Text>
          <Text style={styles.cardBody}>Dinos tu nombre para personalizar tu plan nutricional.</Text>
          <AppInput placeholder="Tu nombre" value={name} onChangeText={setName} />
          <AppButton
            title="Continuar"
            onPress={() => {
              saludar();
              setStep('goal');
            }}
          />
        </Card>
      )}

      {step === 'goal' && (
        <Card>
          <Text style={styles.cardTitle}>Selecciona tu objetivo</Text>
          <Text style={styles.cardBody}>Elige el enfoque para ajustar automáticamente tu recomendación.</Text>
          <View style={styles.optionGrid}>
            {(['bajar', 'subir', 'mantener'] as Goal[]).map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.pill, goal === option && styles.pillActive]}
                onPress={() => {
                  setGoal(option);
                  setStep('data');
                }}>
                <Text style={[styles.pillText, goal === option && styles.pillTextActive]}>{option.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.actionsRow}>
            <AppButton title="Analizar comida" variant="secondary" onPress={() => router.push('/camera')} />
            <AppButton title="Ver recetas" variant="ghost" onPress={() => router.push('/recetas')} />
          </View>
        </Card>
      )}

      {step === 'data' && (
        <>
          <Card>
            <Text style={styles.cardTitle}>Tus datos</Text>
            <Text style={styles.cardBody}>Completa tus medidas para calcular una recomendación diaria.</Text>
            <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />
            <AppInput placeholder="Estatura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
            <AppInput placeholder="Peso (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Nivel de actividad</Text>
            <Text style={styles.cardBody}>Selecciona el nivel que mejor representa tu rutina semanal.</Text>
            {(['sedentaria', 'baja', 'moderada', 'alta'] as ActivityLevel[]).map(level => (
              <TouchableOpacity
                key={level}
                style={[styles.optionRow, activity === level && styles.optionRowActive]}
                onPress={() => setActivity(level)}>
                <Text style={[styles.optionText, activity === level && styles.optionTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
            <AppButton title="Calcular plan" onPress={calcularCalorias} />
          </Card>

          {calories && macros && (
            <Card>
              <Text style={styles.cardTitle}>Resumen diario</Text>
              <Text style={styles.kcal}>{calories} kcal</Text>
              <Text style={styles.metric}>🥩 Proteína: {macros.protein} g</Text>
              <Text style={styles.metric}>🍞 Carbohidratos: {macros.carbs} g</Text>
              <Text style={styles.metric}>🥑 Grasas: {macros.fats} g</Text>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
  },
  cardBody: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F8FAFC',
  },
  pillActive: {
    borderColor: palette.primary,
    backgroundColor: '#E0E7FF',
  },
  pillText: {
    ...typography.caption,
  },
  pillTextActive: {
    color: palette.primaryDark,
  },
  actionsRow: {
    gap: spacing.sm,
  },
  optionRow: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    backgroundColor: '#F8FAFC',
  },
  optionRowActive: {
    borderColor: palette.success,
    backgroundColor: '#DCFCE7',
  },
  optionText: {
    ...typography.caption,
    textTransform: 'capitalize',
  },
  optionTextActive: {
    color: '#166534',
  },
  kcal: {
    fontSize: 38,
    fontWeight: '800',
    color: palette.primary,
  },
  metric: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '600',
  },
});
