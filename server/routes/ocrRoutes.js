import express from "express";
import { processImage } from "../services/ocrService.js";
import { parseReceiptText } from "../services/geminiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { base64Image } = req.body;

  try {
    const { rawText } = await processImage(base64Image);
    const structuredItems = await parseReceiptText(rawText);

    res.json({ rawText, structuredItems });
  } catch (err) {
    console.error("Errore OCR:", err);
    res.status(500).json({ error: "Errore OCR" });
  }
});

export default router;
