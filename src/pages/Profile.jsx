import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`, // Invia il token come header
          },
        });

        setUserData(res.data); // Salva i dati dell'utente ricevuti dalla risposta
      } catch (err) {
        console.error('Errore caricamento profilo:', err);
        console.log("🔑 Token ricevuto:", token);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Benvenuto,</h2>
          <p className="text-lg text-blue-600">{userData.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Panoramica Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-gray-50">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-md text-gray-800">{userData.email}</p>
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <p className="text-sm text-gray-500">ID Utente</p>
            <p className="text-md text-gray-800">{userData._id}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 relative">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          I miei acquisti OCR ▼
        </button>

        {showMenu && (
          <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
            <ul className="divide-y divide-gray-200">
              {/* Qui andrebbero dinamicamente i risultati OCR */}
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Scontrino 1 - 12/05/2025</li>
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Scontrino 2 - 10/05/2025</li>
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Scontrino 3 - 05/05/2025</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
