// controllers/receiptController.js

import Receipt from "../models/receiptModel.js";

export const createReceipt = async (req, res) => {
  try {
    const { rawText, products, imageBase64, date } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Nessun prodotto fornito." });
    }

    const receipt = new Receipt({
      userId: req.user._id, // <-- prendi da req.user, NON dal body
      rawText,
      products,
      imageBase64,
      date: date ? new Date(date) : new Date(),
    });

    await receipt.save();

    res.status(201).json(receipt);
  } catch (error) {
    console.error("Errore nella creazione della ricevuta:", error);
    res.status(500).json({ message: "Errore nella creazione della ricevuta." });
  }
};
