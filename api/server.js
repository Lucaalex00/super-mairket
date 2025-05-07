// Importazioni necessarie
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Carica le variabili dal file .env

const app = express();

// Middleware
app.use(express.json());

// API per ricevere l'immagine dal frontend e fare OCR
app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    // Fai la chiamata a Google Vision usando la chiave API
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
    console.error("Errore durante la chiamata a Google Vision:", err);
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
