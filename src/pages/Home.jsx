import Scanner from "../components/Scanner";

export default function Home() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Scannerizza un prodotto</h2>
      <Scanner />
    </div>
  );
}
