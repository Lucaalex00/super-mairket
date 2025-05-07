import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Carica variabili dal file .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware per parsare il body delle richieste
app.use(express.json());
app.use(cors());

// Funzione per fare l'OCR
const getOcrText = async (base64Image) => {
  try {
    // Chiamata a Google Vision API per fare l'OCR
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.OCR_API_KEY}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );
    // Estrae il testo dall'API di Google Vision
    const text = response.data.responses[0]?.fullTextAnnotation?.text || "";
    return text;
  } catch (error) {
    console.error("Errore durante l'OCR:", error);
    throw new Error("Errore durante l'elaborazione dell'immagine");
  }
};

// Funzione per inviare la richiesta a Gemini
const getGeminiDescription = async (text) => {
  try {
    // Chiamata a Gemini (o al servizio che usi)
    const response = await axios.post("https://api.gemini.com/describe", {
      text: text, // Utilizza il testo estratto dall'OCR
    });

    return response.data.description; // Supponendo che Gemini restituisca una descrizione
  } catch (error) {
    console.error("Errore durante la chiamata a Gemini:", error);
    throw new Error(
      "Errore nel recupero delle informazioni dal servizio Gemini"
    );
  }
};

// Endpoint per ricevere l'immagine, fare l'OCR e ottenere la descrizione
app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    console.log("Inizio processo di OCR...");

    // Step 1: Fai l'OCR sull'immagine
    const ocrText = await getOcrText(base64Image);
    if (!ocrText) {
      return res
        .status(400)
        .json({ error: "Nessun testo rilevato nell'immagine" });
    }

    console.log("Testo estratto:", ocrText);

    // Step 2: Invia il testo estratto a Gemini
    const geminiDescription = await getGeminiDescription(ocrText);
    console.log("Descrizione ottenuta da Gemini:", geminiDescription);

    // Restituisci il testo dell'OCR e la descrizione di Gemini
    res.json({
      ocrText: ocrText,
      geminiDescription: geminiDescription,
    });
  } catch (error) {
    console.error("Errore durante il processo:", error);
    res.status(500).json({ error: error.message || "Errore interno" });
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`🚀 Server in esecuzione sulla porta ${port}`);
});
