import { useEffect, useRef, useState } from "react";
import ProductCardComponent from "./ProductCardComponent";

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [structuredItems, setStructuredItems] = useState([]);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
    setLoading(true);
    setError("");
    setRawText("");
    setStructuredItems([]);

    try {
      // 1) OCR + parsing
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      if (!ocrResponse.ok) throw new Error("Errore OCR");

      const ocrResult = await ocrResponse.json();
      setRawText(ocrResult.rawText);

      // 2) Controllo prodotti nel DB (batch)
      const checkResponse = await fetch("http://localhost:3000/api/check-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prodotti: ocrResult.structuredItems || [] }),
      });

      if (!checkResponse.ok) throw new Error("Errore controllo prodotti");

      const checkedItems = await checkResponse.json();
      setStructuredItems(checkedItems);
    } catch (err) {
      console.error(err);
      setError("Errore nell'elaborazione o nel controllo prodotti");
    } finally {
      setLoading(false);
    }
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
            <ProductCardComponent key={idx} item={item} />
          ))}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
