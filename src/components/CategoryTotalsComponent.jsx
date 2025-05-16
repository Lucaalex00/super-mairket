import React from "react";

export default function CategoryTotalsComponent({ products }) {
  // Raggruppa prodotti per categoria con somma totale (price * quantity)
  const totalsByCategory = products.reduce((acc, prod) => {
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
