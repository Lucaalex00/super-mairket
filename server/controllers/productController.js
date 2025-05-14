// controllers/productController.js
import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    // Recuperiamo i prodotti dal database
    const products = await Product.find();

    res.status(200).json(products); // Assicurati di inviare `formatted`, non `products`
  } catch (error) {
    console.error("Errore nel recupero dei prodotti:", error);
    res.status(500).json({ message: "Errore nel recupero dei prodotti" });
  }
};
export const addProduct = async (req, res) => {
  console.log("help" + res + req);
};
