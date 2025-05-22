import {useState} from 'react'

export default function ProductCardComponent({ item, onAdd }) {
  const borderColor = item.inDatabase ? "border-green-500" : "border-red-500";
  const textColor = item.inDatabase ? "text-green-500" : "text-red-500";
  const [loading, setLoading] = useState(false);

  async function handleAddProduct(item) {
    if (loading || item.inDatabase) return;  // blocca se già in caricamento o già in DB

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Usa un id stabile (ad esempio basato su nome + categoria)
      const stableId = item.nome_prodotto.toLowerCase().replace(/\s+/g, '-') + '-' + item.categoria.toLowerCase().replace(/\s+/g, '-');

      const productToSend = {
        id: stableId,
        name: item.nome_prodotto,
        category: item.categoria,
        price: item.prezzo,
        description: item.dettagli || "",
        image: "",
        aisle: ""
      };

      const response = await fetch('http://localhost:5173/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productToSend)
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Toggle prodotto:', data);
      if(onAdd) onAdd();
    } catch (error) {
      console.error('Errore durante il toggle del prodotto:', error);
    } finally {
      setLoading(false);
    }
  }


  

  return (
    <div
      onClick={() => {
        if (!item.inDatabase) handleAddProduct(item);
      }}
      className={`bg-white p-4 rounded-xl shadow-md border ${borderColor} cursor-pointer ${item.inDatabase ? "cursor-not-allowed opacity-80" : ""}`}
      title={item.inDatabase ? "Prodotto già presente" : "Clicca per aggiungere prodotto"}
    >
      <p><strong>🛒 Prodotto:</strong> {item.nome_prodotto || "N/A"}</p>
      <p><strong>📂 Categoria:</strong> {item.categoria || "N/A"}</p>
      <p><strong>📦 Quantità:</strong> {item.quantita ?? 1}</p>
      <p><strong>💶 Prezzo:</strong> €{item.prezzo !== undefined ? item.prezzo.toFixed(2) : "-"}</p>
      <p className={textColor}>
        {item.inDatabase
          ? "Prodotto disponibile nel database"
          : "Prodotto non disponibile nel database (clicca per aggiungere)"}
      </p>
    </div>
  );
}
