import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">PesaRate</h1>
      <p className="text-slate-600 leading-relaxed mb-8">
        Sending or receiving money across currencies? Banks and mobile money
        channels often quote rates marked up above the real market rate —
        and you rarely know by how much. PesaRate shows you the true
        mid-market rate and what your channel's markup is actually costing you.
      </p>
      <Link
        to="/calculator"
        className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
      >
        Check a rate
      </Link>
    </div>
  );
}