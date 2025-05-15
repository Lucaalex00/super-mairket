import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Errore caricamento profilo:', err);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Benvenuto,</h2>
          <p className="text-lg text-blue-600 truncate max-w-xs">{userData.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-md font-semibold text-gray-900">{userData.email || '-'}</p>
        </div>
        <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
          <p className="text-sm text-gray-500">ID Utente</p>
          <p className="text-md font-semibold text-gray-900">{userData._id || '-'}</p>
        </div>
      </section>

      <div className="relative mt-10">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          I miei acquisti OCR <span className="text-xl">▼</span>
        </button>

        {showMenu && (
          <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
            <ul className="divide-y divide-gray-200">
              {/* TODO: sostituire con dati reali */}
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
                Scontrino 1 - 12/05/2025
              </li>
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
                Scontrino 2 - 10/05/2025
              </li>
              <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
                Scontrino 3 - 05/05/2025
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
