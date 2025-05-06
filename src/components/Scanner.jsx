import { useRef, useEffect } from "react";

export default function Scanner() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error("Errore webcam:", err);
      });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <video ref={videoRef} className="rounded-xl shadow" autoPlay muted />
    </div>
  );
}
