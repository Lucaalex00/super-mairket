// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // Carica le variabili dal file .env

const app = express();

// Usa la variabile di ambiente PORT, se presente, altrimenti usa 3000 come fallback
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

console.log("✅ ENV:", process.env.MONGODB_URI);
console.log("✅ PORT:", process.env.PORT);

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Schema e Modello del Prodotto
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  aisle: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

// API per ottenere i prodotti
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Avvio del server
// Render richiede che l'app ascolti su '0.0.0.0', non 'localhost'
// Ascolta sulla porta dinamica passata tramite Render
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
