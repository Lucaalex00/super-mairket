// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { processImage } from "../src/services/ocrService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ocr", async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Immagine non fornita" });
  }

  try {
    const result = await processImage(base64Image);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
