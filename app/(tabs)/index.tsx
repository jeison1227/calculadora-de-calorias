import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { CalorieProgress } from '@/components/ui/calorie-progress';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { AppInput } from '@/components/ui/input';
import { palette, radius, spacing, typography } from '@/constants/design-system';

type Goal = 'bajar' | 'subir' | 'mantener';
type ActivityLevel = 'sedentaria' | 'baja' | 'moderada' | 'alta';

const goalLabels: Record<Goal, string> = {
  bajar: 'Definición',
  subir: 'Ganancia',
  mantener: 'Mantenimiento',
};

const quickActions = [
  { title: 'Escanear comida', subtitle: 'IA por cámara', icon: 'camera-outline' as const, onPress: () => router.push('/camera') },
  { title: 'Agregar manual', subtitle: 'Registro rápido', icon: 'pencil-outline' as const, onPress: () => router.push('/manual') },
  { title: 'Recetas fit', subtitle: 'Ideas balanceadas', icon: 'silverware-fork-knife' as const, onPress: () => router.push('/recetas') },
];

const mealsToday = [
  { name: 'Desayuno', detail: 'Avena, banana y nueces', calories: 410, icon: 'coffee-outline' as const },
  { name: 'Almuerzo', detail: 'Pollo con quinoa y ensalada', calories: 620, icon: 'food-outline' as const },
  { name: 'Snack', detail: 'Yogur y berries', calories: 180, icon: 'cup-outline' as const },
  { name: 'Cena', detail: 'Salmón con vegetales', calories: 520, icon: 'fish' as const },
];

const weeklyCalories = [1680, 1770, 1620, 1840, 1720, 1900, 1760];
const weeklyLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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

  const currentTarget = calories ?? 2200;
  const consumedToday = calories ? Math.round(calories * 0.72) : 1730;
  const chartMax = Math.max(...weeklyCalories) + 100;
  const chartWidth = (Dimensions.get('window').width - spacing.md * 2 - spacing.md * 2 - spacing.md * 3) / 7;

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

  const saludar = () => {
    if (!name.trim()) return;
    Speech.speak(`Hola ${name}, listo para mejorar tu nutrición`, { language: 'es' });
  };

  const calcularCalorias = async () => {
    if (!age || !height || !weight || !activity || !goal) {
      Speech.speak('Completa todos los datos primero', { language: 'es' });
      return;
    }

    const tmb = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
    const factores: Record<ActivityLevel, number> = { sedentaria: 1.2, baja: 1.375, moderada: 1.55, alta: 1.725 };

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
    await AsyncStorage.setItem('perfilUsuario', JSON.stringify({ name, goal, activity, calories: resultado, macros: macrosCalc }));
    Speech.speak(`Tu meta diaria es ${resultado} calorías`, { language: 'es' });
  };

  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.greeting}>Hola{name ? `, ${name}` : ''}</Text>
          <Text style={styles.heroTitle}>Tu plan diario de nutrición inteligente</Text>
          <View style={styles.goalBadge}>
            <MaterialCommunityIcons name="target" size={14} color="#001B0B" />
            <Text style={styles.goalText}>{goal ? goalLabels[goal] : 'Configura tu objetivo'}</Text>
          </View>
        </View>

        <Card style={styles.dashboardCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Resumen diario</Text>
            <MaterialCommunityIcons name="trending-up" size={22} color={palette.primary} />
          </View>
          <Text style={styles.kcal}>{consumedToday} kcal</Text>
          <Text style={styles.caption}>Consumo actual sobre una meta de {currentTarget} kcal.</Text>
          <CalorieProgress consumed={consumedToday} target={currentTarget} />
          <View style={styles.macroRow}>
            <View style={styles.macroPill}><Text style={styles.macroValue}>{macros?.protein ?? 142}g</Text><Text style={styles.macroLabel}>PROT</Text></View>
            <View style={styles.macroPill}><Text style={styles.macroValue}>{macros?.carbs ?? 220}g</Text><Text style={styles.macroLabel}>CARB</Text></View>
            <View style={styles.macroPill}><Text style={styles.macroValue}>{macros?.fats ?? 73}g</Text><Text style={styles.macroLabel}>GRAS</Text></View>
          </View>
        </Card>

        <Card>
          <View style={styles.rowBetween}><Text style={styles.cardTitle}>Comidas de hoy</Text><Text style={styles.caption}>4 comidas</Text></View>
          {mealsToday.map(meal => (
            <View key={meal.name} style={styles.mealRow}>
              <MaterialCommunityIcons name={meal.icon} size={18} color={palette.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDetail}>{meal.detail}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          ))}
        </Card>

        <Card>
          <View style={styles.rowBetween}><Text style={styles.cardTitle}>Semana</Text><Text style={styles.caption}>Tendencia calórica</Text></View>
          <View style={styles.chartRow}>
            {weeklyCalories.map((value, index) => {
              const height = Math.max(20, (value / chartMax) * 120);
              const isToday = index === weeklyCalories.length - 1;
              return (
                <View key={`${weeklyLabels[index]}-${value}`} style={[styles.barWrap, { width: chartWidth }]}>
                  <View style={[styles.bar, { height, backgroundColor: isToday ? palette.primary : '#294472' }]} />
                  <Text style={[styles.barLabel, isToday && { color: palette.primary }]}>{weeklyLabels[index]}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {quickActions.map(action => (
          <TouchableOpacity key={action.title} style={styles.quickAction} onPress={action.onPress}>
            <MaterialCommunityIcons name={action.icon} size={22} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#7F93BE" />
          </TouchableOpacity>
        ))}

        {step === 'welcome' && (
          <Card>
            <Text style={styles.cardTitle}>Bienvenido</Text>
            <AppInput placeholder="Tu nombre" value={name} onChangeText={setName} />
            <AppButton title="Continuar" onPress={() => { saludar(); setStep('goal'); }} />
          </Card>
        )}

        {step === 'goal' && (
          <Card>
            <Text style={styles.cardTitle}>Selecciona tu objetivo</Text>
            <View style={styles.goalRow}>
              {(['bajar', 'subir', 'mantener'] as Goal[]).map(option => (
                <TouchableOpacity key={option} style={[styles.goalOption, goal === option && styles.goalOptionActive]} onPress={() => { setGoal(option); setStep('data'); }}>
                  <Text style={[styles.goalOptionText, goal === option && { color: '#001B0B' }]}>{goalLabels[option]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {step === 'data' && (
          <Card>
            <Text style={styles.cardTitle}>Configura tu plan</Text>
            <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />
            <AppInput placeholder="Estatura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
            <AppInput placeholder="Peso (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
            {(['sedentaria', 'baja', 'moderada', 'alta'] as ActivityLevel[]).map(level => (
              <TouchableOpacity key={level} style={[styles.activityOption, activity === level && styles.activityOptionActive]} onPress={() => setActivity(level)}>
                <Text style={styles.activityText}>{level}</Text>
              </TouchableOpacity>
            ))}
            <AppButton title="Calcular calorías" onPress={calcularCalorias} />
          </Card>
        )}
      </ScrollView>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  heroCard: { backgroundColor: palette.surfaceElevated, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: spacing.md, gap: spacing.sm },
  greeting: { ...typography.body, color: palette.primary },
  heroTitle: { ...typography.subtitle },
  goalBadge: { alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.xs, alignItems: 'center', backgroundColor: palette.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  goalText: { ...typography.caption, color: '#001B0B' },
  dashboardCard: { backgroundColor: '#0D172D' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.subtitle, fontSize: 20 },
  kcal: { fontSize: 40, color: '#F8FAFC', fontWeight: '800' },
  caption: { ...typography.caption },
  macroRow: { flexDirection: 'row', gap: spacing.sm },
  macroPill: { flex: 1, backgroundColor: '#1B2D50', borderRadius: radius.md, padding: spacing.sm, alignItems: 'center' },
  macroValue: { color: '#EFF6FF', fontWeight: '800', fontSize: 16 },
  macroLabel: { ...typography.caption, color: '#8FA6D5' },
  cardTitle: { ...typography.subtitle, fontSize: 19 },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#142441', borderRadius: radius.md, padding: spacing.sm },
  mealName: { ...typography.body, color: palette.textPrimary },
  mealDetail: { ...typography.caption },
  mealCalories: { ...typography.caption, color: '#D4E4FF' },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, gap: spacing.xs },
  barWrap: { alignItems: 'center', gap: 4 },
  bar: { width: '100%', borderRadius: radius.sm },
  barLabel: { ...typography.caption },
  quickAction: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, borderRadius: radius.md, padding: spacing.md },
  actionTitle: { ...typography.body, color: palette.textPrimary },
  actionSubtitle: { ...typography.caption },
  goalRow: { gap: spacing.sm },
  goalOption: { borderWidth: 1, borderColor: palette.border, borderRadius: radius.md, padding: spacing.sm, backgroundColor: '#142441' },
  goalOptionActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  goalOptionText: { ...typography.body },
  activityOption: { borderWidth: 1, borderColor: palette.border, borderRadius: radius.md, padding: spacing.sm, backgroundColor: '#142441' },
  activityOptionActive: { borderColor: palette.primary, backgroundColor: '#133323' },
  activityText: { ...typography.caption, textTransform: 'capitalize' },
});
