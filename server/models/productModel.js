import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome_prodotto: String,
  descrizione: String,
  prezzo: Number,
  categoria: String,
  immagine: String,
  corsia: String,
});

export default mongoose.model("Product", productSchema);
