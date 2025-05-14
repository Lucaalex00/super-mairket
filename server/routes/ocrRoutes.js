import express from "express";
import { processImage } from "../services/ocrService.js"; // Funzione di OCR

const router = express.Router();

// Aggiungi una rotta per l'elaborazione delle immagini (OCR)
router.post("/", async (req, res) => {
  const { base64Image } = req.body;

  try {
    const { rawText, structuredItems } = await processImage(base64Image);

    // Logica di controllo del prodotto
    const updatedItems = await processAndCheckProducts(structuredItems);

    res.json({
      rawText,
      structuredItems: updatedItems,
    });
  } catch (err) {
    console.error("Errore durante l'elaborazione dell'immagine:", err);
    res.status(500).json({ error: "Errore nell'elaborazione dell'immagine." });
  }
});

// Funzione per verificare la presenza dei prodotti nel database
const processAndCheckProducts = async (items) => {
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      try {
        const productInDb = await Product.findOne({
          nome_prodotto: item.nome_prodotto,
          descrizione: item.descrizione,
        });

        if (productInDb) {
          return { ...item, inDatabase: true };
        } else {
          return { ...item, inDatabase: false };
        }
      } catch (err) {
        console.error(
          "Errore durante la ricerca del prodotto nel database:",
          err
        );
        return { ...item, inDatabase: false };
      }
    })
  );

  return updatedItems;
};

export default router;
