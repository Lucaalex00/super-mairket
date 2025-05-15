export default function ProductCardComponent({ item }) {
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md border ${
        item.inDatabase ? "border-green-500" : "border-red-500"
      }`}
    >
      <p><strong>🛒 Prodotto:</strong> {item.nome_prodotto}</p>
      <p><strong>📂 Categoria:</strong> {item.categoria}</p>
      <p><strong>📦 Quantità:</strong> {item.quantita || 1}</p>
      <p><strong>💶 Prezzo:</strong> €{item.prezzo?.toFixed(2)}</p>
      <p className={`text-${item.inDatabase ? "green" : "red"}-500`}>
        {item.inDatabase
          ? "Prodotto disponibile nel database"
          : "Prodotto non disponibile nel database"}
      </p>
    </div>
  );
}