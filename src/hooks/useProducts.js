// src/hooks/useProducts.js
import { useState, useEffect } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const res = await fetch(
          "https://super-mairket.onrender.com/api/products",
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Errore nel recupero dei prodotti");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  return { products, loading, error };
}
