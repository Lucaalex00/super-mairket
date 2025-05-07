import { useEffect, useRef, useState } from "react";

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrResult, setOcrResult] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Funzione per avviare la fotocamera
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

  // Funzione per acquisire l'immagine e inviarla al backend
  const captureAndSend = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
    await sendToGoogleVision(base64Image);
  };

  // Funzione per inviare l'immagine al backend per OCR
  const sendToGoogleVision = async (base64Image) => {
    setLoading(true);
    setOcrResult("");
    setLabels([]);

    try {
      const response = await fetch("http://localhost:3000/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image,
        }),
      });

      const result = await response.json();
      const text = result.text || "Nessun testo rilevato.";
      const labelResults = result.labelResults || [];

      setOcrResult(text);
      setLabels(labelResults.map((l) => l.description));
    } catch (err) {
      console.error(err);
      setOcrResult("Errore durante l'elaborazione dell'immagine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Scanner Fotocamera</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="relative w-full aspect-video bg-black rounded overflow-hidden mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full scale-x-[-1] h-full object-cover" />
      </div>

      <button
        onClick={captureAndSend}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition mb-4"
      >
        Scatta e Analizza
      </button>

      {loading && <p className="text-blue-500">Analisi in corso...</p>}

      {ocrResult && (
        <div className="bg-gray-100 p-4 rounded shadow whitespace-pre-wrap mb-4">
          <h3 className="font-semibold mb-2">Testo Rilevato:</h3>
          {ocrResult}
        </div>
      )}

      {labels.length > 0 && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Oggetto Rilevato:</h3>
          <ul className="list-disc pl-6">
            {labels.map((label, idx) => (
              <li key={idx}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
