// src/services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseReceiptText = async (ocrText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Il seguente testo è il risultato OCR di uno scontrino. Estrai una lista JSON di oggetti con:
- nome_prodotto
- categoria (es. "Latticini", "Bevande", "Snack")
- prezzo (numerico in euro, es. 1.49)

Rispondi solo con JSON valido.

Testo OCR:
"""
${ocrText}
"""
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  try {
    // Pulizia e parsing della risposta
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Errore nel parsing della risposta Gemini:", err, text);
    throw new Error("Impossibile analizzare il contenuto dello scontrino");
  }
};
