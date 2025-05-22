import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  aisle: String, // opzionale
});

export default mongoose.model("Product", productSchema);
