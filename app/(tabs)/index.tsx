import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  // ───────────── ESTADOS ─────────────
  const [step, setStep] = useState<'welcome' | 'goal' | 'data'>('welcome');

  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'bajar' | 'subir' | 'mantener' | null>(null);
  const [activity, setActivity] =
    useState<'sedentaria' | 'baja' | 'moderada' | 'alta' | null>(null);

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [calories, setCalories] = useState<number | null>(null);
  const [macros, setMacros] = useState<{
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);

  // ───────────── VOZ ─────────────
  const saludar = () => {
    if (!name.trim()) return;
    Speech.speak(`Hola ${name}, bienvenido a tu calculadora inteligente`, {
      language: 'es',
    });
  };

  // ───────────── CALCULAR + IA ─────────────
  const calcularCalorias = async () => {
    if (!age || !height || !weight || !activity || !goal) {
      Speech.speak('Completa todos los datos primero', { language: 'es' });
      return;
    }

    const tmb =
      10 * Number(weight) +
      6.25 * Number(height) -
      5 * Number(age);

    const factores = {
      sedentaria: 1.2,
      baja: 1.375,
      moderada: 1.55,
      alta: 1.725,
    };

    let calorias = tmb * factores[activity];

    if (goal === 'bajar') calorias *= 0.8;
    if (goal === 'subir') calorias *= 1.15;

    const resultado = Math.round(calorias);
    setCalories(resultado);

    const macrosCalc = {
      protein: Math.round((resultado * 0.3) / 4),
      carbs: Math.round((resultado * 0.4) / 4),
      fats: Math.round((resultado * 0.3) / 9),
    };

    setMacros(macrosCalc);

    await AsyncStorage.setItem(
      'perfilUsuario',
      JSON.stringify({
        name,
        goal,
        activity,
        calories: resultado,
        macros: macrosCalc,
      })
    );

    Speech.speak(
      `Tu consumo diario recomendado es de ${resultado} calorías`,
      { language: 'es' }
    );

    // 🔗 BACKEND IA
    try {
      const res = await fetch('http://192.168.1.13:3001/ia/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          goal,
          calories: resultado,
          macros: macrosCalc,
        }),
      });

      const data = await res.json();
      if (data.respuestaIA) {
        Speech.speak(data.respuestaIA, { language: 'es' });
      }
    } catch (error) {
      console.log('❌ Error llamando IA:', error);
    }
  };

  // ───────────── CARGAR PERFIL ─────────────
  useEffect(() => {
    const cargarPerfil = async () => {
      const data = await AsyncStorage.getItem('perfilUsuario');
      if (data) {
        const perfil = JSON.parse(data);
        setName(perfil.name);
        setGoal(perfil.goal);
        setActivity(perfil.activity);
        setCalories(perfil.calories);
        setMacros(perfil.macros);
        setStep('data');
      }
    };
    cargarPerfil();
  }, []);

  // ───────────── UI ─────────────
  return (
    <View style={styles.container}>

      {/* BIENVENIDA */}
      {step === 'welcome' && (
        <>
          <Text style={styles.title}>👋 Bienvenido</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              saludar();
              setStep('goal');
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      )}

      {/* OBJETIVO */}
      {step === 'goal' && (
        <>
          <Text style={styles.title}>🎯 Tu objetivo</Text>

          {['bajar', 'subir', 'mantener'].map(g => (
            <TouchableOpacity
              key={g}
              style={styles.optionButton}
              onPress={() => {
                setGoal(g as any);
                setStep('data');
              }}
            >
              <Text style={styles.optionText}>{g}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#16a34a' }]}
            onPress={() => router.push('/camera')}
          >
            <Text style={styles.buttonText}>
              📷 Analizar comida con foto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f59e0b' }]}
            onPress={() => router.push('/recetas')}
          >
            <Text style={styles.buttonText}>🍽 Recetas</Text>
          </TouchableOpacity>
        </>
      )}

      {/* DATOS */}
      {step === 'data' && (
        <>
          <Text style={styles.title}>📋 Tus datos</Text>

          <TextInput style={styles.input} placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />
          <TextInput style={styles.input} placeholder="Estatura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
          <TextInput style={styles.input} placeholder="Peso (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />

          <Text style={styles.subtitle}>Nivel de actividad</Text>

          {['sedentaria', 'baja', 'moderada', 'alta'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                activity === level && { borderColor: '#22c55e', borderWidth: 2 },
              ]}
              onPress={() => setActivity(level as any)}
            >
              <Text style={styles.optionText}>{level}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={calcularCalorias}>
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>

          {calories && <Text style={styles.subtitle}>🔥 {calories} kcal</Text>}

          {macros && (
            <>
              <Text style={styles.macroText}>🥩 {macros.protein} g proteína</Text>
              <Text style={styles.macroText}>🍞 {macros.carbs} g carbohidratos</Text>
              <Text style={styles.macroText}>🥑 {macros.fats} g grasas</Text>
            </>
          )}
        </>
      )}
    </View>
  );
}

// ───────────── ESTILOS ─────────────
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', marginVertical: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#6366f1', padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  optionButton: { padding: 14, backgroundColor: '#e5e7eb', marginBottom: 10, borderRadius: 10 },
  optionText: { textAlign: 'center', fontWeight: 'bold' },
  macroText: { textAlign: 'center', marginTop: 4, fontWeight: '600' },
});
