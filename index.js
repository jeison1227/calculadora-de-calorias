import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // MODELO ACTUAL
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Analiza esta imagen de comida.

Indica:
- Qué alimento es
- Una estimación aproximada de calorías
- Aproximación de proteínas, carbohidratos y grasas

Responde en español.
              `,
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

    const respuesta =
      completion.choices[0]?.message?.content ||
      "No pude identificar el alimento.";

    res.json({ respuestaIA: respuesta });

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

app.listen(PORT, () => {
  console.log(`✅ Backend IA activo en http://localhost:${PORT}`);
});
