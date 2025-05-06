import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Catalog from "./pages/Catalog";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">
          {[
            { path: "/", label: "Home" },
            { path: "/scanner", label: "Scanner" },
            { path: "/catalog", label: "Catalogo" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition hover:text-blue-600 ${
                location.pathname === link.path ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
