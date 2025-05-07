// src/services/ocrService.js
import axios from "axios";
import { Translate } from "@google-cloud/translate";
import dotenv from "dotenv";

dotenv.config();

const translate = new Translate();

export const processImage = async (base64Image) => {
  console.log("Inizio elaborazione immagine...");

  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.OCR_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [
              { type: "TEXT_DETECTION" },
              { type: "LABEL_DETECTION", maxResults: 5 },
            ],
          },
        ],
      }
    );

    console.log("Risposta da Google Vision:", response.data); // Logga la risposta completa

    const result = response.data;
    const text =
      result.responses?.[0]?.fullTextAnnotation?.text ||
      "Nessun testo rilevato.";
    const labelResults = result.responses?.[0]?.labelAnnotations || [];

    console.log("Testo OCR:", text);
    console.log("Etichette rilevate:", labelResults);

    // Traduci le etichette in italiano
    const translatedLabels = await translateLabels(
      labelResults.map((l) => l.description)
    );
    console.log("Etichette tradotte:", translatedLabels);

    return { text, translatedLabels };
  } catch (err) {
    console.error(
      "Errore durante la chiamata a Google Vision o traduzione:",
      err
    );
    throw new Error("Errore durante l’elaborazione dell’immagine");
  }
};

// Funzione per tradurre le etichette in italiano
const translateLabels = async (labels) => {
  console.log("Inizio traduzione etichette...");
  try {
    const translations = await Promise.all(
      labels.map(async (label) => {
        const [translation] = await translate.translate(label, "it");
        return translation;
      })
    );
    console.log("Traduzioni completate:", translations);
    return translations;
  } catch (error) {
    console.error("Errore nella traduzione delle etichette:", error);
    throw new Error("Errore nella traduzione delle etichette");
  }
};
