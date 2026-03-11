import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
import { AppInput } from '@/components/ui/input';
import { palette, radius, shadows, spacing, typography } from '@/constants/design-system';

type Goal = 'bajar' | 'subir' | 'mantener';
type ActivityLevel = 'sedentaria' | 'baja' | 'moderada' | 'alta';

const goalLabels: Record<Goal, string> = {
  bajar: 'Bajar peso',
  subir: 'Ganar masa',
  mantener: 'Mantener',
};

const quickActions = [
  {
    title: 'Analizar comida',
    subtitle: 'Escanea tu plato con IA',
    icon: 'camera-outline' as const,
    onPress: () => router.push('/camera'),
  },
  {
    title: 'Registro manual',
    subtitle: 'Añade alimentos fácilmente',
    icon: 'clipboard-text-outline' as const,
    onPress: () => router.push('/manual'),
  },
  {
    title: 'Recetas saludables',
    subtitle: 'Ideas balanceadas para hoy',
    icon: 'silverware-fork-knife' as const,
    onPress: () => router.push('/recetas'),
  },
];

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
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.greeting}>¡Hola{name ? `, ${name}` : ''}! 👋</Text>
          <Text style={styles.welcomeBody}>Tu panel de bienestar para planificar un día saludable.</Text>
        </View>
        <View style={styles.goalBadge}>
          <MaterialCommunityIcons name="target" size={16} color={palette.primaryDark} />
          <Text style={styles.goalText}>{goal ? goalLabels[goal] : 'Define objetivo'}</Text>
        </View>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Resumen diario</Text>
          <MaterialCommunityIcons name="fire" size={24} color={palette.accent} />
        </View>
        <Text style={styles.kcal}>{calories ?? '--'} kcal</Text>
        <Text style={styles.summarySubtext}>
          {calories
            ? 'Meta calórica recomendada para mantener constancia hoy.'
            : 'Completa tus datos para activar tu recomendación personalizada.'}
        </Text>

        <View style={styles.macroRow}>
          <View style={styles.macroPill}>
            <MaterialCommunityIcons name="food-drumstick-outline" size={16} color={palette.primaryDark} />
            <Text style={styles.macroText}>Prot {macros?.protein ?? '--'}g</Text>
          </View>
          <View style={styles.macroPill}>
            <MaterialCommunityIcons name="bread-slice-outline" size={16} color={palette.primaryDark} />
            <Text style={styles.macroText}>Carb {macros?.carbs ?? '--'}g</Text>
          </View>
          <View style={styles.macroPill}>
            <MaterialCommunityIcons name="water-outline" size={16} color={palette.primaryDark} />
            <Text style={styles.macroText}>Grasa {macros?.fats ?? '--'}g</Text>
          </View>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      </View>
      <View style={styles.quickActionsGrid}>
        {quickActions.map(action => (
          <TouchableOpacity key={action.title} style={styles.actionButton} onPress={action.onPress}>
            <MaterialCommunityIcons name={action.icon} size={24} color={palette.primary} />
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>

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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  welcomeHeader: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DCE6FF',
    gap: spacing.sm,
    ...shadows,
  },
  greeting: {
    ...typography.subtitle,
    color: palette.textPrimary,
  },
  welcomeBody: {
    ...typography.body,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#E0E7FF',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  goalText: {
    ...typography.caption,
    color: palette.primaryDark,
  },
  summaryCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  summarySubtext: {
    ...typography.caption,
    color: '#CBD5E1',
  },
  kcal: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  macroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#E2E8F0',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  macroText: {
    ...typography.caption,
    color: '#0F172A',
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  quickActionsGrid: {
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows,
  },
  actionTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  actionSubtitle: {
    ...typography.caption,
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
});
