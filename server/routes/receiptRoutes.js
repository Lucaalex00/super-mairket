import express from "express";
import Receipt from "../models/receiptModel.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const receipts = await Receipt.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: "Errore interno server" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { rawText, structuredItems, imageBase64, date } = req.body;
    if (!rawText || !structuredItems || !imageBase64 || !date) {
      return res.status(400).json({ message: "Campi obbligatori mancanti" });
    }

    /* const newReceipt = new Receipt({
      userId: req.user._id,
      rawText,
      structuredItems,
      imageBase64,
      date: new Date(date),
    });

    await newReceipt.save(); */
    res.status(201).json(newReceipt);
  } catch (err) {
    res.status(500).json({ message: "Errore interno server" });
  }
});

export default router;
