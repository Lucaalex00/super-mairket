// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { processImage } from "../src/services/ocrService"; // Importa il servizio OCR

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API per ricevere l'immagine e fare OCR
app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    // Chiama il servizio OCR per eseguire l'elaborazione
    const result = await processImage(base64Image);
    res.json(result); // Restituisce il testo e le etichette tradotte
    console.log(result);
  } catch (err) {
    console.error("Errore durante l'elaborazione dell'immagine:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'elaborazione dell'immagine" });
  }
});

// Avvio del server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
