import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ user: userId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const toggleProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      id, // campo unico identificativo del prodotto
      name,
      description,
      price,
      category,
      image,
      aisle, // opzionale
    } = req.body;

    if (!id || !name || price === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required fields: id, name or price" });
    }

    // Controlla se prodotto esiste già per questo utente
    const existing = await Product.findOne({ user: userId, id });

    if (existing) {
      // Se c'è, lo rimuovo (toggle off)
      await existing.remove();
      return res.status(200).json({ removed: true });
    } else {
      // Se non c'è, lo aggiungo (toggle on)
      const newProduct = new Product({
        user: userId,
        id,
        name,
        description,
        price,
        category,
        image,
        aisle,
      });
      await newProduct.save();
      return res.status(201).json({ added: true });
    }
  } catch (error) {
    console.error("Error toggling product:", error);
    res.status(500).json({ message: "Server error toggling product" });
  }
};
