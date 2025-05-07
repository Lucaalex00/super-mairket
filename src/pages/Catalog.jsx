import React, { useMemo, useState } from 'react';
import useProducts from '../hooks/useProducts';
import useCategoryColors from '../hooks/useCategoryColors';
import SpinnerComponent from "../components/SpinnerComponent";
import { getColorLuminosity } from '../utils/colorUtils';

export default function Catalog() {
  const { products, loading, error } = useProducts();
  const [selectedId, setSelectedId] = useState(null);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const { categoryColors } = useCategoryColors(categories);

  const groupByCategory = (products) => {
    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  };

  const groupedProducts = groupByCategory(products);

  const toggleCard = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Supermercato</h1>

      {Object.keys(groupedProducts).map((category) => (
        <section key={category} className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{category}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedProducts[category].map((product) => {
              const categoryColor = categoryColors[category] || "#FFFFFF";
              const textColor = getColorLuminosity(categoryColor) > 128 ? "text-black" : "text-white";

              return (
                <div
                  key={product.id}
                  onClick={() => toggleCard(product.id)}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out`}
                  style={{
                    backgroundColor: categoryColor,
                    height: selectedId === product.id ? "auto" : "18rem",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <p className="absolute top-0 right-1 text-sm font-semibold text-black">
                      Corsia: {product.aisle}
                    </p>
                  </div>
                  <div className="relative p-4">
                    <h3 className={`text-xl font-semibold ${textColor}`}>{product.name}</h3>

                    {selectedId === product.id && (
                      <div className="mt-4">
                        <p className={`text-sm font-semibold ${textColor}`}>{product.description}</p>
                        <p className={`text-lg font-bold ${textColor}`}>€{product.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
