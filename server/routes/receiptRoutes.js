import express from "express";
import Receipt from "../models/receiptModel.js";
import protect from "../middleware/authMiddleware.js";
import { createReceipt } from "../controllers/receiptController.js";

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

router.post("/", protect, createReceipt);

export default router;
