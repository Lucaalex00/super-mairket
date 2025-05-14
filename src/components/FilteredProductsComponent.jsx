import React from "react";

const FilteredProductsComponent = ({ filteredProducts }) => {
  return (
    <div className="grid gap-4 mt-4">
      <h3 className="text-lg font-semibold">Prodotti Filtrati (Disponibili nel Database):</h3>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-md border border-green-500">
            <p><strong>🛒 Prodotto:</strong> {item.nome_prodotto}</p>
            <p><strong>📂 Categoria:</strong> {item.categoria}</p>
            <p><strong>💶 Prezzo:</strong> €{item.prezzo?.toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p className="text-red-500">Nessun prodotto disponibile nel database.</p>
      )}
    </div>
  );
};

export default FilteredProductsComponent;