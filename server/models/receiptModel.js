// models/receiptModel.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const receiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    imageBase64: { type: String },
    products: [productSchema],
    total: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model("Receipt", receiptSchema);

export default Receipt;
