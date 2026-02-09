import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary" style={{ fontFamily: "Lemon" }}>
          404
        </h1>
        <h2 className="text-2xl font-bold text-chart-2" style={{ fontFamily: "Lekton" }}>
          Siden ble ikke funnet
        </h2>
        <p className="text-chart-3 max-w-md" style={{ fontFamily: "Lekton" }}>
          Beklager, vi kunne ikke finne siden du leter etter.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 mt-4 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:text-primary hover:bg-secondary hover:border-secondary hover:scale-105 transition-all"
          style={{ fontFamily: "Lekton" }}
        >
          Tilbake til Hjem
        </Link>
      </div>
    </div>
  );
}
