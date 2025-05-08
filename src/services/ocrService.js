// src/services/ocrService.js
import axios from "axios";
import dotenv from "dotenv";
import { parseReceiptText } from "./geminiService.js";

dotenv.config();

export const processImage = async (base64Image) => {
  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.OCR_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );

    const text = response.data?.responses?.[0]?.fullTextAnnotation?.text || "";

    if (!text) throw new Error("Nessun testo rilevato nell'immagine");

    const structuredItems = await parseReceiptText(text);

    return {
      rawText: text,
      structuredItems,
    };
  } catch (err) {
    console.error("Errore OCR o Gemini:", err);
    throw new Error("Errore nell'elaborazione dell'immagine");
  }
};
