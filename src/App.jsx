import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/NavbarComponent";
import RequireAuth from "./components/RequireAuthComponent";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar separata */}
      <Navbar location={location} />

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE ROUTES */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
