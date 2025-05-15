export default function ProductCardComponent({ item }) {
  const borderColor = item.inDatabase ? "border-green-500" : "border-red-500";
  const textColor = item.inDatabase ? "text-green-500" : "text-red-500";

  return (
    <div className={`bg-white p-4 rounded-xl shadow-md border ${borderColor}`}>
      <p><strong>🛒 Prodotto:</strong> {item.nome_prodotto || "N/A"}</p>
      <p><strong>📂 Categoria:</strong> {item.categoria || "N/A"}</p>
      <p><strong>📦 Quantità:</strong> {item.quantita ?? 1}</p>
      <p><strong>💶 Prezzo:</strong> €{item.prezzo !== undefined ? item.prezzo.toFixed(2) : "-"}</p>
      <p className={textColor}>
        {item.inDatabase
          ? "Prodotto disponibile nel database"
          : "Prodotto non disponibile nel database"}
      </p>
    </div>
  );
}
