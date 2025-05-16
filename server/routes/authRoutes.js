import express from "express";
import {
  registerUser,
  loginUser,
  getUserData,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotta per registrazione
router.post("/register", registerUser);

// Rotta per login
router.post("/login", loginUser);

// Rotta per ottenere i dati dell'utente autenticato
router.get("/", protect, getUserData);

export default router;
