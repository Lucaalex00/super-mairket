import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReceiptsListComponent from "../components/ReceiptListComponent";
import CategoryTotalsComponent from "../components/CategoryTotalsComponent";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({});
  const [receipts, setReceipts] = useState([]);
  // Ora showReceipts può avere 3 stati: "none", "list", "totals"
  const [viewMode, setViewMode] = useState("none");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Errore caricamento profilo:", err);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get("/api/receipts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceipts(res.data);
      } catch (err) {
        console.error("Errore caricamento ricevute:", err);
      }
    };

    if (token) fetchReceipts();
  }, [token]);

  // Lista unica dei nomi supermercati, da passare al filtro
  const supermarkets = [...new Set(receipts.map((r) => r.supermarket_name).filter(Boolean))];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Raccogli tutti i prodotti di tutte le ricevute per i totali
  const allProducts = receipts.flatMap(receipt =>
  (receipt.products || []).map(prod => ({
    ...prod,
    supermarket_name: receipt.supermarket_name,
  }))
);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Benvenuto,</h2>
          <p className="text-lg text-blue-600 truncate max-w-xs">{userData.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-md font-semibold text-gray-900">{userData.email || "-"}</p>
        </div>
        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
          <p className="text-sm text-gray-500">ID Utente</p>
          <p className="text-md font-semibold text-gray-900">{userData._id || "-"}</p>
        </div>
      </section>

      <div className="relative mt-10 flex gap-4">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "none" : "list")}
          className={`cursor-pointer px-6 py-2 rounded-lg shadow transition duration-300 ease-in-out flex items-center gap-2 ${
            viewMode === "list"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          aria-expanded={viewMode === "list"}
          aria-controls="receipts-dropdown"
        >
          I miei acquisti OCR
          <span id="1"
            className={`text-xl inline-block transform transition-transform duration-300 ${
              viewMode === "list" ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <button
          onClick={() => setViewMode(viewMode === "totals" ? "none" : "totals")}
          className={`cursor-pointer px-6 py-2 rounded-lg shadow transition duration-300 ease-in-out flex items-center gap-2 ${
            viewMode === "totals"
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          aria-expanded={viewMode === "totals"}
          aria-controls="totals-dropdown"
        >
          Totali
          <span
            className={`text-xl inline-block transform transition-transform duration-300 ${
              viewMode === "totals" ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Dropdown ricevute */}
      {viewMode === "list" && (
        <div
          id="receipts-dropdown"
          className="mt-4 w-full bg-white border rounded-lg shadow-lg z-20 max-h-96 overflow-auto p-6 animate-fadeIn"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#a0aec0 #edf2f7" }}
        >
          {receipts.length === 0 ? (
            <p className="text-gray-500 italic">Nessuna ricevuta trovata.</p>
          ) : (
            <ReceiptsListComponent receipts={receipts} token={token} setReceipts={setReceipts} />
          )}
        </div>
      )}

      {/* Dropdown totali per categoria */}
      {viewMode === "totals" && (
        <div
          id="totals-dropdown"
          className="mt-4 w-full bg-white border rounded-lg shadow-lg z-20 max-h-96 overflow-auto p-6 animate-fadeIn"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#a0aec0 #edf2f7" }}
        >
          <CategoryTotalsComponent products={allProducts} supermarkets={supermarkets} />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        /* Custom scrollbar for WebKit */
        #receipts-dropdown::-webkit-scrollbar,
        #totals-dropdown::-webkit-scrollbar {
          width: 8px;
        }
        #receipts-dropdown::-webkit-scrollbar-track,
        #totals-dropdown::-webkit-scrollbar-track {
          background: #edf2f7;
          border-radius: 6px;
        }
        #receipts-dropdown::-webkit-scrollbar-thumb,
        #totals-dropdown::-webkit-scrollbar-thumb {
          background-color: #a0aec0;
          border-radius: 6px;
          border: 2px solid #edf2f7;
        }
      `}</style>
    </div>
  );
};

export default Profile;