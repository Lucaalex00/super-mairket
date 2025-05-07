import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { dotenv, process } from "dotenv";
import axios from "axios";
dotenv.config(); // Carica le variabili dal file .env

const app = express();

// Usa la variabile di ambiente PORT, se presente, altrimenti usa 3000 come fallback
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// API per ricevere l'immagine dal frontend e fare OCR
app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    // Fai la chiamata a Google Vision usando la chiave API del backend
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.OCR_API_KEY}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              { type: "TEXT_DETECTION" },
              { type: "LABEL_DETECTION", maxResults: 5 },
            ],
          },
        ],
      }
    );

    const result = response.data;
    const text =
      result.responses?.[0]?.fullTextAnnotation?.text ||
      "Nessun testo rilevato.";
    const labelResults = result.responses?.[0]?.labelAnnotations || [];

    res.json({ text, labelResults });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Errore durante l'elaborazione dell'immagine" });
  }
});

// Endpoint per fare OCR
app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    // Chiamata a Google Vision API
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

    const result = response.data;
    const text =
      result.responses?.[0]?.fullTextAnnotation?.text ||
      "Nessun testo rilevato.";
    const labelResults = result.responses?.[0]?.labelAnnotations || [];

    res.json({ text, labelResults });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Errore durante l'elaborazione dell'immagine" });
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
