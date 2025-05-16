import express from "express";
import protect from "../middleware/authMiddleware.js"; // Importa il middleware di protezione
import { getProducts, addProduct } from "../controllers/productController.js"; // I tuoi controller

const router = express.Router();

// Proteggi la rotta per ottenere i prodotti (solo utenti autenticati)
router.get("/", getProducts); //

// Proteggi la rotta per aggiungere un prodotto (solo utenti autenticati)
router.post("/add", protect, addProduct); // Solo utenti autenticati possono aggiungere prodotti

export default router;
