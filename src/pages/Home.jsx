import { useState } from "react";
import recipeData from "../data/recipes";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tutte");

  const categories = ["Tutte", ...new Set(recipeData.map(r => r.category))];

  const filteredRecipes = recipeData.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "Tutte" || recipe.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Ricettario</h1>

      {/* 🔍 Ricerca + Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Cerca una ricetta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl shadow bg-white"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 🧾 Layout dinamico */}
      <div className={`grid transition-all duration-700 ease-in-out ${selected ? "grid-cols-1 md:grid-cols-2 gap-6" : "grid-cols-1"}`}>
        {/* 🎴 Lista Ricette */}
        <div className={`grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 ${selected ? "col-span-1" : "col-span-2"}`}>
          {filteredRecipes.map((recipe, idx) => (
            <div
              key={idx}
              onClick={() => setSelected(recipe)}
              className={`cursor-pointer rounded-3xl overflow-hidden transition-transform hover:-translate-y-1
                ${selected?.name === recipe.name
                  ? "ring-4 ring-green-400 shadow-2xl"
                  : "shadow-lg hover:shadow-2xl"}
                bg-gradient-to-br from-white to-gray-100`}
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{recipe.name}</h3>
                <p className="text-sm text-gray-500">{recipe.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Dettagli Ricetta Selezionata */}
        {selected && (
          <div className="bg-white p-6 rounded-3xl shadow-xl relative transition-all duration-700 ease-in-out">
            {/* ❌ Bottone Chiudi */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
              title="Chiudi"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ingredienti per {selected.name}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {selected.ingredients.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-bold text-gray-700">{item.name}</h4>
                  <p className="text-sm text-gray-600">Corsia: <span className="font-semibold">{item.aisle}</span></p>
                  <p className="text-sm text-gray-600">Prezzo: <span className="font-semibold">€{item.price.toFixed(2)}</span></p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
