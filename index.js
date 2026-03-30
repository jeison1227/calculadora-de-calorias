import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3001;

/* ───────────── CONFIGURACIÓN ───────────── */

app.use(cors());
app.use(express.json({ limit: "20mb" })); // Importante para imágenes base64

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* ───────────── RUTA TEST ───────────── */

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend IA funcionando 🚀" });
});

/* ───────────── IA TEXTO (CALORÍAS PERFIL) ───────────── */

app.post("/ia/calcular", (req, res) => {
  const { name, goal, calories, macros } = req.body;

  if (!name || !goal || !calories || !macros) {
    return res.status(400).json({
      respuestaIA: "Faltan datos para el análisis",
    });
  }

  let mensaje = `Hola ${name}. `;

  if (goal === "bajar") mensaje += "Tu objetivo es bajar de peso. ";
  if (goal === "subir") mensaje += "Tu objetivo es ganar masa muscular. ";
  if (goal === "mantener") mensaje += "Tu objetivo es mantener tu peso actual. ";

  mensaje += `Tu consumo recomendado es ${calories} calorías diarias. `;
  mensaje += `Macros: ${macros.protein}g proteína, ${macros.carbs}g carbohidratos y ${macros.fats}g grasas. `;
  mensaje += "Vas por muy buen camino 💪";

  res.json({ respuestaIA: mensaje });
});

/* ───────────── IA IMAGEN (VISION GROQ) ───────────── */

app.post("/ia/analizar-imagen", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      respuestaIA: "No se recibió ninguna imagen",
    });
  }

  try {
    const systemPrompt = `Eres un nutricionista experto en análisis visual de platos.
Identifica múltiples alimentos visibles en una foto y estima sus macros por porción observada.`;

    const userPrompt = `Analiza esta imagen de comida.

Requisitos:
- Detecta TODOS los alimentos visibles (si hay varios, inclúyelos todos).
- Devuelve una lista con nombre y estimación por alimento.
- Incluye calorías (kcal), proteína, carbohidratos y grasa en gramos por cada alimento.
- Si no estás seguro del nombre exacto, usa un nombre genérico razonable (ej: "ensalada mixta").

Responde EXCLUSIVAMENTE en JSON válido con este formato exacto:
{
  "alimentos": [
    {
      "nombre": "string",
      "calorias": number,
      "proteina": number,
      "carbohidratos": number,
      "grasa": number
    }
  ],
  "resumen": "string"
}

No agregues markdown ni texto fuera del JSON.`;

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // MODELO ACTUAL
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 800,
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      return res.json({
        alimentos: [],
        resumen: "No pude identificar alimentos en la imagen.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("❌ Error parseando JSON de IA:", parseError);
      return res.json({
        alimentos: [],
        resumen: "No pude interpretar correctamente el análisis de la imagen.",
        respuestaIA: rawResponse,
      });
    }

    const alimentos = Array.isArray(parsed.alimentos)
      ? parsed.alimentos.map((item) => ({
          nombre: item?.nombre || "Alimento detectado",
          calorias: Number(item?.calorias) || 0,
          proteina: Number(item?.proteina) || 0,
          carbohidratos: Number(item?.carbohidratos) || 0,
          grasa: Number(item?.grasa) || 0,
        }))
      : [];

    const resumen =
      typeof parsed.resumen === "string" && parsed.resumen.trim()
        ? parsed.resumen
        : alimentos.length
          ? `Se detectaron ${alimentos.length} alimentos.`
          : "No se detectaron alimentos con suficiente confianza.";

    res.json({
      alimentos,
      resumen,
      respuestaIA: resumen,
    });

  } catch (error) {
    console.error("❌ ERROR COMPLETO GROQ:", error);
    res.status(500).json({
      respuestaIA: "Error real en Groq Vision (ver consola backend)",
    });
  }
});

/* ───────────── IA MANUAL (PESO INGRESADO) ───────────── */

app.post("/ia/calcular-manual", (req, res) => {
  const { alimento, peso } = req.body;

  if (!alimento || !peso) {
    return res.status(400).json({
      respuestaIA: "Faltan datos del alimento o peso",
    });
  }

  // Estimación simple base (puedes mejorarla luego)
  const caloriasPor100g = 130; // ejemplo genérico
  const calorias = Math.round((peso / 100) * caloriasPor100g);

  const respuesta = `
El alimento ${alimento} con ${peso} gramos contiene aproximadamente ${calorias} calorías.
`;

  res.json({ respuestaIA: respuesta });
});

/* ───────────── INICIAR SERVIDOR ───────────── */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend IA activo`);
  console.log(`🌐 http://192.168.1.13:${PORT}`);
});
