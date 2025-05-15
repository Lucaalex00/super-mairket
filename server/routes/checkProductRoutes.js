import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

/**
 * POST /api/check-products
 * Riceve in body { prodotti: [{ nome_prodotto, descrizione, ... }, ...] }
 * Per ciascun prodotto:
 *  - toglie l'ultima lettera del nome scansionato
 *  - ricerca in DB qualsiasi prodotto il cui nome (ignora case) inizi con quei caratteri + un qualunque carattere finale
 */
router.post("/", async (req, res) => {
  const { prodotti } = req.body;

  if (!Array.isArray(prodotti)) {
    return res.status(400).json({ error: "prodotti deve essere un array" });
  }

  try {
    const results = await Promise.all(
      prodotti.map(async (item) => {
        // Normalizza e rimuovi l'ultima lettera
        const rawName = item.nome_prodotto || "";
        const normalized = rawName.toLowerCase().trim();
        const base = normalized.slice(0, -1); // tutto tranne l'ultima lettera

        // Costruisci un regex che cerchi esattamente base + un carattere qualsiasi (case-insensitive)
        const regex = new RegExp(`^${base}.?$`, "i");

        // Cerca nel DB un prodotto il cui name corrisponda
        const found = await Product.findOne({ name: { $regex: regex } });

        return {
          ...item,
          inDatabase: !!found,
          matchedName: found ? found.name : null,
        };
      })
    );

    return res.json(results);
  } catch (err) {
    console.error("Errore nel controllo prodotti:", err);
    return res.status(500).json({ error: "Errore server" });
  }
});

export default router;
