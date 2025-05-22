import React from "react";
import ReactDOM from "react-dom";

export default function ImageModalComponent({ base64, onClose, alt = "Immagine ingrandita" }) {
  if (!base64) return null;
  return ReactDOM.createPortal(
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer">
      <img
        src={`data:image/jpeg;base64,${base64}`}
        alt={alt}
        className="max-w-screen max-h-screen object-contain rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        aria-label="Chiudi immagine"
        className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition cursor-pointer"
      >
        &times;
      </button>
    </div>,
    document.body
  );
}