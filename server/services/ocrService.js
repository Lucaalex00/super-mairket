import { ImageAnnotatorClient } from "@google-cloud/vision";
import dotenv from "dotenv";

dotenv.config();

const client = new ImageAnnotatorClient();

export const processImage = async (base64Image) => {
  const request = {
    image: {
      content: base64Image,
    },
  };

  try {
    const [result] = await client.textDetection(request);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      throw new Error("Nessun testo rilevato nell'immagine");
    }

    const rawText = detections.map((text) => text.description).join("\n");

    return { rawText, structuredItems: [] }; // Aggiungi logica per estrarre gli oggetti strutturati
  } catch (err) {
    console.error("Errore API Vision:", err);
    throw new Error("Errore nell'elaborazione dell'immagine");
  }
};
