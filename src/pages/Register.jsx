import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text(); // Leggi la risposta come testo prima
    let data;

    try {
      data = JSON.parse(text); // Tenta di fare il parsing
    } catch (err) {
      throw new Error("Risposta non valida dal server:\n" + text + err);
    }

    if (!res.ok) {
      throw new Error(data.message || "Errore nella registrazione");
    }

    console.log("Registrazione avvenuta:", data);
    localStorage.setItem("token", data.token);
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Crea un nuovo account</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleRegister} className="mt-4">
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
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Register;
