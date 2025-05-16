import React from "react";
import ReactDOM from "react-dom";

export default function ImageModalComponent({ base64, onClose }) {
  if (!base64) return null;

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <img
        src={`data:image/png;base64,${base64}`}
        alt="Scontrino ingrandito"
        className="max-w-full max-h-full rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        aria-label="Chiudi immagine"
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 cursor-pointer"
      >
        &times;
      </button>
    </div>,
    document.body
  );
}
