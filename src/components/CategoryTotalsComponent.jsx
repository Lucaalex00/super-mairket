import React, { useState, useMemo } from "react";

export default function CategoryTotalsComponent({ products }) {
  const [selectedSupermarket, setSelectedSupermarket] = useState("");

  // Lista unica dei supermercati
  const supermarkets = useMemo(() => {
    const unique = new Set(products.map((p) => p.supermarket_name).filter(Boolean));
    return Array.from(unique);
  }, [products]);

  // Filtra i prodotti per supermercato (se selezionato)
  const filteredProducts = useMemo(() => {
    return selectedSupermarket
      ? products.filter((p) => p.supermarket_name === selectedSupermarket)
      : products;
  }, [products, selectedSupermarket]);

  // Totali per categoria
  const totalsByCategory = filteredProducts.reduce((acc, prod) => {
    const cat = prod.category || "Altro";
    const totalPrice = prod.price * prod.quantity;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += totalPrice;
    return acc;
  }, {});

  const categories = Object.keys(totalsByCategory);

  return (
    <div className="p-4 bg-white rounded shadow mt-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Totali per Categoria</h3>

      {/* Filtro supermercato */}
      <div className="mb-4">
        <label htmlFor="supermarket-filter" className="block mb-1 font-medium text-gray-700">
          Filtra per supermercato:
        </label>
        <select
          id="supermarket-filter"
          value={selectedSupermarket}
          onChange={(e) => setSelectedSupermarket(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Tutti</option>
          {supermarkets.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-600">Nessun prodotto disponibile.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border px-3 py-1 text-left">Categoria</th>
              <th className="border px-3 py-1 text-right">Totale (€)</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat} className="hover:bg-indigo-50">
                <td className="border px-3 py-1">{cat}</td>
                <td className="border px-3 py-1 text-right">
                  € {totalsByCategory[cat].toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
