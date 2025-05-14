import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseReceiptText = async (ocrText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Miglioriamo il prompt con una descrizione chiara
  const prompt = `
Il seguente testo è il risultato OCR di uno scontrino. Estrai una lista JSON di oggetti con:
- nome_prodotto: il nome del prodotto
- categoria: la categoria del prodotto (es. "Latticini", "Bevande", "Snack", "Elettronica", ecc.)
- prezzo: il prezzo numerico in euro, es. 1.49
- Se il prodotto ha più informazioni, aggiungi tutti i dettagli necessari.

Rispondi solo con un JSON valido.

Testo OCR:
"""
${ocrText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log("Risposta ricevuta da Gemini:", text); // Stampa la risposta di Gemini

    // Proviamo a estrarre la parte JSON dalla risposta
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    console.log("Risposta JSON:", jsonString); // Stampa il JSON estratto

    // Parse e ritorna l'array degli oggetti
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Errore durante il parsing della risposta Gemini:", err);
    throw new Error("Impossibile analizzare il contenuto dello scontrino");
  }
};
