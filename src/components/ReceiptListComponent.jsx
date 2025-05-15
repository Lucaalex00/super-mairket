// ReceiptListComponent.jsx
import axios from 'axios';

export default function ReceiptsList({ receipts, token, setReceipts }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa ricevuta?")) return;

    try {
      await axios.delete(`/api/receipts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceipts((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Errore nell'eliminazione");
      console.error(err);
    }
  };

  if (receipts.length === 0) return <p>Nessuna ricevuta trovata.</p>;

  return (
    <div className="space-y-6">
      {receipts.map((receipt) => (
        <div key={receipt._id} className="border p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              Data: {new Date(receipt.date).toLocaleDateString()}
            </h3>
            <button
              onClick={() => handleDelete(receipt._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Elimina
            </button>
          </div>

          {receipt.imageBase64 && (
            <img
              src={receipt.imageBase64}
              alt="Scontrino"
              className="max-w-xs mb-3 rounded border"
            />
          )}

          <div>
            <h4 className="font-semibold mb-1">Prodotti:</h4>
            {receipt.products && receipt.products.length > 0 ? (
              <ul className="list-disc list-inside mb-2">
                {receipt.products.map((p, idx) => (
                  <li key={idx}>
                    {p.name} - {p.quantity} x €{p.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Nessun prodotto rilevato.</p>
            )}
            {receipt.total !== undefined && (
              <p className="font-semibold">Totale: €{receipt.total.toFixed(2)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
