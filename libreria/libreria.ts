import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface Comida {
  nombre: string;
  calorias: number;
  macros?: Macros;
}

export interface DiaCalorico {
  fecha: string;
  totalCalorias: number;
  macros: Macros;
  comidas: Comida[];
}

/* ───────────────────────────── */
/* 🔥 Obtener fecha actual */
/* ───────────────────────────── */
const obtenerFechaHoy = () => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0]; // formato YYYY-MM-DD
};

/* ───────────────────────────── */
/* 📦 Obtener datos del día */
/* ───────────────────────────── */
export const obtenerDiaActual = async (): Promise<DiaCalorico> => {
  const hoy = obtenerFechaHoy();
  const key = `dia-${hoy}`;

  const data = await AsyncStorage.getItem(key);

  if (data) {
    return JSON.parse(data);
  }

  const nuevoDia: DiaCalorico = {
    fecha: hoy,
    totalCalorias: 0,
    macros: { protein: 0, carbs: 0, fats: 0 },
    comidas: [],
  };

  await AsyncStorage.setItem(key, JSON.stringify(nuevoDia));

  return nuevoDia;
};

/* ───────────────────────────── */
/* ➕ Agregar comida al día */
/* ───────────────────────────── */
export const agregarComidaAlDia = async (comida: Comida) => {
  const hoy = obtenerFechaHoy();
  const key = `dia-${hoy}`;

  const dia = await obtenerDiaActual();

  dia.totalCalorias += comida.calorias;

  if (comida.macros) {
    dia.macros.protein += comida.macros.protein;
    dia.macros.carbs += comida.macros.carbs;
    dia.macros.fats += comida.macros.fats;
  }

  dia.comidas.push(comida);

  await AsyncStorage.setItem(key, JSON.stringify(dia));
};

/* ───────────────────────────── */
/* 📊 Obtener resumen del día */
/* ───────────────────────────── */
export const obtenerResumenDelDia = async (): Promise<DiaCalorico> => {
  return await obtenerDiaActual();
};

/* ───────────────────────────── */
/* 🔄 Reiniciar día */
/* ───────────────────────────── */
export const reiniciarDia = async () => {
  const hoy = obtenerFechaHoy();
  const key = `dia-${hoy}`;

  await AsyncStorage.removeItem(key);
};
