import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"; // Importiamo mongoose per MongoDB
import path from "path";
import { fileURLToPath } from "url";

// Carica le variabili dal .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Import delle rotte
import productRoutes from "./routes/productRoutes.js"; // Gestisce le rotte per i prodotti
import ocrRoutes from "./routes/ocrRoutes.js"; // Gestisce le rotte per l'OCR
import authRoutes from "./routes/authRoutes.js"; // Gestisce le rotte per l'autenticazione
import checkProductRoutes from "./routes/checkProductRoutes.js"; // Gestisce le rotte per l'autenticazione
import receiptRoutes from "./routes/receiptRoutes.js"; //Gestisce le rotte delle ricevute

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Se stai lavorando con cookie o credenziali
  })
);
app.use(express.json({ limit: "10mb" }));

// Connetti a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore nella connessione a MongoDB:", err));

// Impostiamo le rotte
app.use("/api/ocr", ocrRoutes); // Gestione dell'OCR
app.use("/api/products", productRoutes); // Gestione dei prodotti
app.use("/api/auth", authRoutes); // Gestione dell'autenticazione
app.use("/api/check-products", checkProductRoutes); // Controllo prodotti in DATABASE
app.use("/api/receipts", receiptRoutes); // Gestione salvataggio ricevute

// Controlliamo le rotte
app.use((req, res, next) => {
  console.log("🔍 Route non intercettata:", req.method, req.originalUrl);
  next();
});

// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
