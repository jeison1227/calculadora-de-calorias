import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { CalorieProgress } from '@/components/ui/calorie-progress';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { AppInput } from '@/components/ui/input';
import { radius, spacing } from '@/constants/design-system';
import { useAppTheme } from '@/hooks/use-app-theme';

type Goal = 'bajar' | 'subir' | 'mantener';
type ActivityLevel = 'sedentaria' | 'baja' | 'moderada' | 'alta';

export default function HomeScreen() {
  const { colors, typography, colorScheme, toggleTheme } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal>('mantener');
  const [activity, setActivity] = useState<ActivityLevel>('moderada');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState<number>(2200);

  useEffect(() => {
    AsyncStorage.getItem('perfilUsuario').then(data => {
      if (!data) return;
      const profile = JSON.parse(data);
      setName(profile.name ?? '');
      setGoal(profile.goal ?? 'mantener');
      setActivity(profile.activity ?? 'moderada');
      setCalories(profile.calories ?? 2200);
    });
  }, []);

  const calcularCalorias = async () => {
    if (!age || !height || !weight) return;
    const tmb = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
    const factor: Record<ActivityLevel, number> = { sedentaria: 1.2, baja: 1.375, moderada: 1.55, alta: 1.725 };
    let result = tmb * factor[activity];
    if (goal === 'bajar') result *= 0.8;
    if (goal === 'subir') result *= 1.15;
    const rounded = Math.round(result);
    setCalories(rounded);
    await AsyncStorage.setItem('perfilUsuario', JSON.stringify({ name, goal, activity, calories: rounded }));
    Speech.speak(`Tu meta diaria es ${rounded} calorías`, { language: 'es' });
  };

  return (
    <FadeInView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Card style={styles.heroCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.heroTitle}>Plan diario</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme} accessibilityRole="button" accessibilityLabel="Cambiar tema" accessibilityHint="Alterna entre modo claro y oscuro">
              <MaterialCommunityIcons name={colorScheme === 'dark' ? 'weather-sunny' : 'moon-waning-crescent'} size={18} color={colors.textPrimary} />
              <Text style={styles.toggleText}>{colorScheme === 'dark' ? 'Claro' : 'Oscuro'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.caption}>Hola{name ? `, ${name}` : ''}</Text>
          <CalorieProgress consumed={Math.round(calories * 0.72)} target={calories} />
        </Card>

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/camera')}><Text style={styles.actionTitle}>Escanear comida</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/manual')}><Text style={styles.actionTitle}>Agregar manual</Text></TouchableOpacity>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Configura tu plan</Text>
          <AppInput placeholder="Tu nombre" value={name} onChangeText={setName} />
          <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />
          <AppInput placeholder="Estatura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
          <AppInput placeholder="Peso (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          <AppButton title="Calcular calorías" onPress={calcularCalorias} />
        </Card>
      </ScrollView>
    </FadeInView>
  );
}

const createStyles = (colors: any, typography: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  heroCard: { backgroundColor: colors.surfaceElevated },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { ...typography.subtitle },
  caption: { ...typography.body },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickAction: { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  actionTitle: { ...typography.body, color: colors.textPrimary, textAlign: 'center' },
  cardTitle: { ...typography.subtitle, fontSize: 20 },
  toggleButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 6, backgroundColor: colors.surface },
  toggleText: { ...typography.caption, color: colors.textPrimary },
});
