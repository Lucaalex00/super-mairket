// models/Purchase.js
import mongoose from "mongoose";

// PRODUCTS BLUEPRINT
const productItemSchema = new mongoose.Schema({
  nome_prodotto: String,
  categoria: String,
  prezzo: Number,
  quantità: { type: Number, default: 1 },
});

// PURCHASES BLUEPRINT
const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  data_acquisto: { type: Date, default: Date.now },
  negozio: String,
  totale: Number,
  prodotti: [productItemSchema],
  origine: { type: String, enum: ["ocr", "manuale"], default: "ocr" },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
