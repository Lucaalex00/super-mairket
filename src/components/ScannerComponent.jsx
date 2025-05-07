import { useEffect, useRef, useState } from "react";

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrResult, setOcrResult] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geminiResponse, setGeminiResponse] = useState(null);

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
    await sendToBackend(base64Image);
  };

  const sendToBackend = async (base64Image) => {
    setLoading(true);
    setOcrResult("");
    setLabels([]);
    try {
      const response = await fetch("https://your-render-backend-url/api/ocr", { // Sostituisci con il tuo endpoint su Render
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      const result = await response.json();
      setOcrResult(result.text);
      setLabels(result.labelResults.map((l) => l.description));

      // Passa il prompt a Gemini per ricevere informazioni sul prodotto
      if (result.labelResults.length > 0) {
        await fetchGeminiInfo(result.labelResults.map((l) => l.description).join(", "));
      }
    } catch (err) {
      console.error(err);
      setOcrResult("Errore durante l'elaborazione dell'immagine.");
    } finally {
      setLoading(false);
    }
  };

  // Funzione per inviare il prompt a Gemini (o GPT-4)
  const fetchGeminiInfo = async (labels) => {
    try {
      const prompt = `Puoi fornire una descrizione e le caratteristiche dei seguenti oggetti? ${labels}`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const geminiData = await response.json();
      setGeminiResponse(geminiData?.description || "Non ci sono informazioni disponibili.");
    } catch (error) {
      console.error(error);
      setGeminiResponse("Errore nella richiesta a Gemini.");
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

      {geminiResponse && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          <h3 className="font-semibold mb-2">Descrizione Prodotto:</h3>
          <p>{geminiResponse}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
