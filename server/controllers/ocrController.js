// controllers/ocrController.js

import { processImage } from "../services/visionService.js";
import { parseReceiptText } from "../services/geminiService.js";

export const handleOcr = async (req, res) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: "Immagine non fornita" });
    }

    // OCR con Google Vision
    const { rawText } = await processImage(base64Image);

    // Parsing del testo con Gemini per ottenere il JSON strutturato
    const structuredItems = await parseReceiptText(rawText);

    res.json({ rawText, structuredItems });
  } catch (error) {
    console.error("Errore OCR:", error);
    res.status(500).json({ message: "Errore durante l'elaborazione OCR" });
  }
};
