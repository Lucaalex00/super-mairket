export default function ProductCardComponent({ item }) {
  const borderColor = item.inDatabase ? "border-green-500" : "border-red-500";
  const textColor = item.inDatabase ? "text-green-500" : "text-red-500";

  const handleAddProduct = async () => {
    if (item.inDatabase) return; // Non fare nulla se prodotto già nel db

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Devi effettuare il login per aggiungere un prodotto.");
      return;
    }

    try {
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome_prodotto: item.nome_prodotto,
          categoria: item.categoria || "",
          prezzo: item.prezzo || 0,
          // aggiungi altri campi se vuoi
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiunta del prodotto.");
      }

      alert("Prodotto aggiunto al tuo database personale!");
      // opzionale: aggiorna stato per mostrare che è stato aggiunto, o ricarica lista prodotti
    } catch (error) {
      console.error(error);
      alert("Impossibile aggiungere il prodotto. Riprova.");
    }
  };

  return (
    <div
      onClick={handleAddProduct}
      className={`bg-white p-4 rounded-xl shadow-md border ${borderColor} cursor-pointer`}
      title={item.inDatabase ? "Prodotto presente" : "Clicca per aggiungere prodotto"}
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
