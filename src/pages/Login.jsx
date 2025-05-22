import { useState } from "react";
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Errore nel login");
    // Dopo la fetch di login con successo:
    dispatch(login(data.token));
    console.log("Login avvenuto:", data);
      localStorage.setItem("token", data.token);
      navigate("/profile")
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Accedi al tuo account</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleLogin} className="mt-4">
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;
