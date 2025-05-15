import { useEffect, useState } from "react";
import axios from "axios";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        console.log("✅ Risposta ricevuta:", data);
        setProducts(data);
      } catch (err) {
        console.error("❌ Errore Axios:", err.message);
        if (err.response) {
          console.error("📦 Risposta errore:", err.response.data);
        }
        setError(err.message || "Errore nel caricamento dei prodotti");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 👉 AGGIUNGI setProducts qui sotto
  return { products, setProducts, loading, error };
}
