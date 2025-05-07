import React from "react";
import { getColorLuminosity } from "../utils/colorUtils";

export default function OfferProducts({ products, categoryColors }) {
  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Offerte della settimana</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const bgColor = categoryColors[product.category] || "#ffffff";
          const textColor = getColorLuminosity(bgColor) > 128 ? "text-black" : "text-white";
          return (
            <div
              key={product.id}
              className={`relative rounded-xl overflow-hidden shadow-md ${textColor}`}
              style={{ backgroundColor: bgColor }}
            >
              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">Offerta!</span>
              <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
              <div className="p-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-md">€{product.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
