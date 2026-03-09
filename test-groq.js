import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function testGroq() {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: "Di hola y dime si estás funcionando correctamente",
        },
      ],
    });

    console.log("✅ RESPUESTA GROQ:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ ERROR GROQ:");
    console.error(error);
  }
}

testGroq();
