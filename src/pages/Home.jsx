import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useCategoryColors from "../hooks/useCategoryColors";
import CarouselComponent from "../components/CarouselComponent";
import OfferProducts from "../components/OfferProductsComponent";
import SpinnerComponent from "../components/SpinnerComponent";

export default function Home() {
  const { products, loading, error } = useProducts();

  const [categories, setCategories] = useState([]);
  const { categoryColors } = useCategoryColors(categories);

  // Quando i prodotti sono caricati, estrai le categorie uniche
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  // Funzione per selezionare prodotti casuali
  const getRandomProducts = (count) => [...products].sort(() => 0.5 - Math.random()).slice(0, count);
  const randomProducts = getRandomProducts(8);
  const offers = products.filter(p => p.price < 2).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Benvenuto su Super-Mairket</h1>
        <p className="text-gray-600 mb-6">Scopri offerte, prodotti e trova tutto ciò che ti serve!</p>
        <Link
          to="/catalog"
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition"
        >
          Vai al Catalogo
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Prodotti IN EVIDENZA</h2>
        <CarouselComponent products={randomProducts} categoryColors={categoryColors} />
      </div>

      {/* Offerte */}
      <OfferProducts products={offers} categoryColors={categoryColors} />
    </div>
  );
}
