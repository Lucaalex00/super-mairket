import { useEffect, useState } from "react";
import axios from "axios";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: receipts } = await axios.get("/api/receipts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Estrai tutti i prodotti da tutte le ricevute
        const allProducts = receipts.flatMap((receipt) =>
          receipt.products.map((p) => ({
            ...p,
            supermarket_name: receipt.supermarket_name || "",
          }))
        );

        setProducts(allProducts);
      } catch (err) {
        console.error("❌ Errore Axios:", err.message);
        if (err.response) {
          console.error("📦 Risposta errore:", err.response.data);
        }
        setError(err.message || "Errore nel recupero dei prodotti");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  return { products, setProducts, loading, error };
}
