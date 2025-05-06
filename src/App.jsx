import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-center">Supermarket Scanner AI</h1>
      </header>
      <main className="p-4">
        <Home />
      </main>
    </div>
  );
}

export default App;
