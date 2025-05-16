import express from "express";
import {
  createReceipt,
  getReceipts,
  deleteReceipt,
} from "../controllers/receiptController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getReceipts);
router.post("/", protect, createReceipt);
router.delete("/:id", protect, deleteReceipt); // <-- qui

export default router;
