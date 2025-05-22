import Receipt from "../models/receiptModel.js";

export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(receipts);
  } catch (error) {
    console.error("Errore nel recupero delle ricevute:", error);
    res.status(500).json({ message: "Errore interno server" });
  }
};

export const createReceipt = async (req, res) => {
  try {
    const { rawText, products, imageBase64, date, supermarket_name } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Nessun prodotto fornito." });
    }
    const receipt = new Receipt({
      userId: req.user._id,
      rawText,
      products,
      imageBase64,
      date: date ? new Date(date) : new Date(),
      supermarket_name,
    });
    await receipt.save();
    res.status(201).json(receipt);
  } catch (error) {
    console.error("Errore nella creazione della ricevuta:", error);
    res.status(500).json({ message: "Errore nella creazione della ricevuta." });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Receipt.findById(receiptId);
    if (!receipt)
      return res.status(404).json({ message: "Ricevuta non trovata" });
    if (receipt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorizzato" });
    }
    await receipt.deleteOne();
    res.json({ message: "Ricevuta eliminata con successo" });
  } catch (error) {
    console.error("Errore eliminazione ricevuta:", error);
    res.status(500).json({ message: "Errore del server" });
  }
};
