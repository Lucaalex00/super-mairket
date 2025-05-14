import { useEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts"; // Importa il tuo hook per i prodotti
import FilteredProductsComponent from "../components/FilteredProductsComponent"; // Importa il componente dei prodotti filtrati

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [structuredItems, setStructuredItems] = useState([]);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { products, setProducts } = useProducts(); // Usa i prodotti dal backend
  const [filteredProducts, setFilteredProducts] = useState([]); // Stato per i prodotti filtrati

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Accesso alla fotocamera negato o non disponibile.");
        console.error(err);
      }
    };
    getCameraStream();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureAndSend = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
    await sendToServer(base64Image);
  };

  const sendToServer = async (base64Image) => {
    setLoading(true);
    setError("");
    setRawText("");
    setStructuredItems([]);

    try {
      const response = await fetch("http://localhost:3000/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta del server.");
      }

      const result = await response.json();
      setRawText(result.rawText);
      setStructuredItems(result.structuredItems || []);

      // Verifica se i prodotti sono nel database
      checkIfProductsInDatabase(result.structuredItems || []);
    } catch (err) {
      console.error("Errore durante l'invio dell'immagine:", err);
      setError("Errore nell'elaborazione dell'immagine o del testo. Assicurati che l'immagine contenga dei dati.");
    } finally {
      setLoading(false);
    }
  };

  const checkIfProductsInDatabase = async (items) => {
    const updatedProducts = items.map(async (item) => {
      const res = await fetch("/api/check-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_prodotto: item.nome_prodotto,
          descrizione: item.descrizione,
        }),
      });

      const data = await res.json();
      return {
        ...item,
        inDatabase: data.isProductInDatabase, // Aggiungi la proprietà inDatabase
      };
    });

    // Risolvi tutte le promesse per ottenere i prodotti aggiornati
    const finalProducts = await Promise.all(updatedProducts);
    setProducts(finalProducts); // Aggiorna lo stato con i prodotti controllati

    // Filtra i prodotti che sono nel database
    const filtered = finalProducts.filter((item) => item.inDatabase);
    setFilteredProducts(filtered); // Imposta i prodotti filtrati
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Scanner Scontrino</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="relative w-full aspect-video bg-black rounded overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={captureAndSend}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition mb-4"
      >
        Scatta e Analizza
      </button>

      {loading && <p className="text-blue-500">Analisi in corso...</p>}

      {rawText && (
        <div className="bg-gray-100 p-4 rounded shadow whitespace-pre-wrap mb-4">
          <h3 className="font-semibold mb-2">Testo Rilevato:</h3>
          {rawText}
        </div>
      )}

      {structuredItems.length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Prodotti Riconosciuti:</h3>
          {structuredItems.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white p-4 rounded-xl shadow-md border ${
                item.inDatabase ? "border-green-500" : "border-red-500"
              }`}
            >
              <p><strong>🛒 Prodotto:</strong> {item.nome_prodotto}</p>
              <p><strong>📂 Categoria:</strong> {item.categoria}</p>
              <p><strong>💶 Prezzo:</strong> €{item.prezzo?.toFixed(2)}</p>
              <p className={`text-${item.inDatabase ? "green" : "red"}-500`}>
                {item.inDatabase
                  ? "Prodotto disponibile nel database"
                  : "Prodotto non disponibile nel database"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mostra i prodotti filtrati */}
      <FilteredProductsComponent filteredProducts={filteredProducts} />

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
