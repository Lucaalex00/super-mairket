import { useEffect, useRef, useState } from "react";
import ProductCardComponent from "./ProductCardComponent";
import ImageModalComponent from "./ImageModalComponent";

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [structuredItems, setStructuredItems] = useState([]);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageSource, setImageSource] = useState(null);
  const [usingCamera, setUsingCamera] = useState(true);
  const [supermarketName, setSupermarketName] = useState(""); // <-- nuovo stato

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stato per la modale immagine fullscreen
  const [modalOpen, setModalOpen] = useState(false);

  // Avvia webcam se scelto
  useEffect(() => {
    if (usingCamera) {
      const getCameraStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
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
    }
  }, [usingCamera]);

  // Analizza immagine (da webcam o caricata)
  const analyzeImage = async () => {
    setLoading(true);
    setError("");
    setRawText("");
    setStructuredItems([]);
    try {
      let base64Image;

      if (usingCamera) {
        if (!canvasRef.current || !videoRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
      } else {
        if (!imageSource) {
          setError("Nessuna immagine caricata");
          setLoading(false);
          return;
        }
        base64Image = imageSource;
      }

      // Chiamata OCR
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      if (!ocrResponse.ok) throw new Error("Errore OCR");

      const ocrResult = await ocrResponse.json();
      setRawText(ocrResult.rawText);

      // Controllo prodotti
      const checkResponse = await fetch("/api/check-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prodotti: ocrResult.structuredItems || [] }),
      });

      if (!checkResponse.ok) throw new Error("Errore controllo prodotti");

      const checkedItems = await checkResponse.json();
      console.log("Checked Items:", checkedItems);
      setStructuredItems(checkedItems);
    } catch (err) {
      console.error(err);
      setError("Errore nell'elaborazione o nel controllo prodotti");
    } finally {
      setLoading(false);
    }
  };

  // Salva lo scontrino con token autorizzazione
  const saveReceipt = async () => {
    if (!structuredItems.length || !rawText || !imageSource) {
      setError("Dati mancanti per il salvataggio.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato, effettua il login.");
      }

      // Filtro prodotti validi
      const validProducts = structuredItems
        .filter((p) => p.nome_prodotto && typeof p.prezzo === "number")
        .map((p) => ({
          name: p.nome_prodotto,
          category: p.categoria || "",
          quantity: p.quantita || 1,
          price: p.prezzo,
        }));

      if (validProducts.length === 0) {
        setError("Nessun prodotto valido da salvare.");
        setSaving(false);
        return;
      }

      // Invio validProducts al backend
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rawText,
          products: validProducts,
          imageBase64: imageSource,
          date: new Date().toISOString(),
          supermarket_name: supermarketName,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Non autorizzato, effettua il login.");
        }
        throw new Error("Errore nel salvataggio");
      }

      setSaveSuccess(true);
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
      setError(err.message || "Errore durante il salvataggio dello scontrino");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700 drop-shadow-lg">
        Scanner Scontrino
      </h2>

      {error && (
        <p className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-2 mb-4 animate-fadeIn shadow-md">
          {error}
        </p>
      )}

      <div className="mb-6 flex justify-center gap-6">
        <button
          onClick={() => {
            setUsingCamera(true);
            setImageSource(null);
            setRawText("");
            setStructuredItems([]);
            setError("");
          }}
          className={`px-6 py-3 cursor-pointer rounded-full font-semibold transition-transform transform ${
            usingCamera
              ? "bg-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
          aria-pressed={usingCamera}
        >
          Usa Webcam
        </button>
        <label
          htmlFor="upload"
          className={`px-6 py-3 cursor-pointer rounded-full font-semibold transition-transform transform ${
            usingCamera
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
              : "bg-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
          }`}
        >
          Carica Immagine
          <input
            id="upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                  setImageSource(reader.result.split(",")[1]);
                  setUsingCamera(false);
                  setRawText("");
                  setStructuredItems([]);
                  setError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
        </label>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out">
        {usingCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        ) : imageSource ? (
          <img
            src={`data:image/jpeg;base64,${imageSource}`}
            alt="Immagine caricata"
            className="w-full h-full object-contain rounded-xl cursor-pointer"
            onClick={() => setModalOpen(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 font-medium rounded-xl">
            Nessuna immagine caricata
          </div>
        )}
      </div>

      <button
        onClick={analyzeImage}
        disabled={loading}
        className="mt-6 mx-auto block bg-indigo-600 text-white px-10 py-3 rounded-full font-bold shadow-lg cursor-pointer hover:bg-indigo-700 transition-transform active:scale-95 disabled:opacity-50"
      >
        {loading ? <span className="animate-pulse">Analisi in corso...</span> : "Scatta / Analizza"}
      </button>

      {rawText && (
        <section className="mt-8 p-5 bg-white rounded-lg shadow-md animate-fadeIn max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-indigo-600">Testo Rilevato:</h3>
          <pre>{rawText}</pre>
        </section>
      )}

      {structuredItems.length > 0 && (
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
          <h3 className="col-span-full text-xl font-bold text-indigo-700 mb-4">
            Prodotti Riconosciuti:
          </h3>
          {structuredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1"
            >
              <ProductCardComponent item={item} onAdd={() => {
                setStructuredItems(prev => prev.map(p => p.nome_prodotto === item.nome_prodotto ? { ...p, inDatabase: true } : p))
              }} />
            </div>
          ))}
          <div className="col-span-full text-center mt-4">
            <div className="my-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Supermercato
              </label>
              <input
                type="text"
                value={supermarketName}
                onChange={(e) => setSupermarketName(e.target.value)}
                placeholder="Es. Esselunga, Conad, Coop..."
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={saveReceipt}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg cursor-pointer hover:bg-green-700 transition-transform active:scale-95 disabled:opacity-50"
            >
              {saving ? "Salvataggio in corso..." : "Salva Scontrino"}
            </button>
            {saveSuccess && (
              <p className="mt-2 text-green-600 font-semibold animate-fadeIn">
                ✅ Scontrino salvato con successo!
              </p>
            )}
          </div>
        </section>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Modal immagine fullscreen separato */}
      {modalOpen && <ImageModalComponent base64={imageSource} onClose={() => setModalOpen(false)} />}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
