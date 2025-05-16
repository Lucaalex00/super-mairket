import { useState, useEffect } from "react";
import axios from "axios";
import ImageModalComponent from "./ImageModalComponent"; // importa il nuovo componente

export default function ReceiptsListComponent({ receipts, token, setReceipts }) {
  const [confirmId, setConfirmId] = useState(null); // id della ricevuta da confermare eliminazione
  const [toast, setToast] = useState(null); // messaggio di toast { type, message }
  const [modalImage, setModalImage] = useState(null); // base64 immagine per modale

  // Toast auto-dismiss dopo 3 secondi
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/receipts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceipts((prev) => prev.filter((r) => r._id !== id));
      setToast({ type: "success", message: "Ricevuta eliminata con successo" });
      setConfirmId(null);
    } catch (err) {
      setToast({ type: "error", message: "Errore nell'eliminazione" });
      console.error(err);
      setConfirmId(null);
    }
  };

  if (receipts.length === 0)
    return <p className="italic text-gray-500">Nessuna ricevuta trovata.</p>;

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white font-semibold z-50
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          role="alert"
          aria-live="assertive"
        >
          {toast.message}
        </div>
      )}

      {/* MODALE IMMAGINE USANDO PORTAL */}
      <ImageModalComponent base64={modalImage} onClose={() => setModalImage(null)} />

      <div className="space-y-6">
        {receipts.map((receipt) => (
          <div
            key={receipt._id}
            className="border p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-700">
                Data: {new Date(receipt.date).toLocaleDateString()}
              </h3>

              {/* Bottone elimina o conferma */}
              {confirmId === receipt._id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(receipt._id)}
                    className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                  >
                    Elimina Definitivamente
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition duration-300"
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(receipt._id)}
                  className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                  aria-label={`Elimina ricevuta del ${new Date(
                    receipt.date
                  ).toLocaleDateString()}`}
                >
                  Elimina
                </button>
              )}
            </div>

            {receipt.imageBase64 && (
              <img
                onClick={() => setModalImage(receipt.imageBase64)}
                src={`data:image/png;base64,${receipt.imageBase64}`}
                alt="Scontrino"
                className="max-w-xs w-full mb-4 rounded border mx-auto cursor-pointer hover:brightness-90 transition"
                style={{ objectFit: "contain", maxHeight: 180 }}
                title="Clicca per ingrandire"
              />
            )}

            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Prodotti:</h4>
              {receipt.products && receipt.products.length > 0 ? (
                <ul className="list-disc list-inside mb-3 max-h-48 overflow-auto space-y-1 text-gray-700">
                  {receipt.products.map((p, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{p.name}</span>
                      <span>
                        {p.quantity} × €{p.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">Nessun prodotto rilevato.</p>
              )}
              {receipt.total !== undefined && (
                <p className="font-semibold text-gray-900">
                  Totale: €{receipt.total.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}