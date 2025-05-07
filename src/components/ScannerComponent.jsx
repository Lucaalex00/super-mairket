import { useState, useRef } from "react";

export default function ScannerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrResult, setOcrResult] = useState("");
  const [geminiDescription, setGeminiDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setGeminiDescription("");
    setError("");

    try {
      const response = await fetch("https://super-mairket.onrender.com/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      const result = await response.json();
      setOcrResult(result.ocrText);
      setGeminiDescription(result.geminiDescription);
    } catch (err) {
      setError("Errore durante l'elaborazione dell'immagine.");
      console.error("Errore:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Scanner e Analizzatore</h2>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={captureAndSend}>Scatta e Analizza</button>
      {loading && <p>Elaborazione in corso...</p>}
      {error && <p>{error}</p>}
      {ocrResult && <div><h3>Testo OCR:</h3><p>{ocrResult}</p></div>}
      {geminiDescription && <div><h3>Descrizione Gemini:</h3><p>{geminiDescription}</p></div>}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
