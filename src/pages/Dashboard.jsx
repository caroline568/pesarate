import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRates } from "../api";

const PAIRS = [
  { from: "USD", to: "KES" },
  { from: "GBP", to: "KES" },
  { from: "EUR", to: "KES" },
];

export default function Dashboard() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(250000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = {};
      for (const p of PAIRS) {
        try {
          const data = await getRates(p.from);
          results[`${p.from}${p.to}`] = data.rates?.[p.to] ?? null;
        } catch {
          results[`${p.from}${p.to}`] = null;
        }
      }
      try {
        const kesData = await getRates("KES");
        results.KESUSD = kesData.rates?.USD ?? null;
        results.KESGBP = kesData.rates?.GBP ?? null;
      } catch {
        results.KESUSD = null;
        results.KESGBP = null;
      }
      setRates(results);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-medium mb-1">Good morning.</h1>
      <p className="text-white/50 text-sm mb-8">Here's what your money is doing today.</p>

      <p className="text-xs text-white/40 uppercase mb-3">Live market snapshot</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {PAIRS.map((p) => {
          const key = `${p.from}${p.to}`;
          const rate = rates[key];
          return (
            <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-white/60 mb-1">{p.from} / {p.to}</p>
              <p className="text-xl font-medium">{loading ? "…" : rate ? rate.toFixed(2) : "—"}</p>
              <p className="text-xs text-white/40 mt-1">Live from open.er-api.com</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <p className="text-xs text-white/40 uppercase mb-2">Your money</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="bg-transparent text-2xl font-medium outline-none mb-3 w-full"
        />
        <div className="flex gap-6 text-sm text-white/70">
          <p>≈ USD {rates.KESUSD ? (amount * rates.KESUSD).toFixed(2) : "—"}</p>
          <p>≈ GBP {rates.KESGBP ? (amount * rates.KESGBP).toFixed(2) : "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/convert" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10">
          <p className="text-sm font-medium">Convert</p>
          <p className="text-xs text-white/40 mt-1">Check a conversion</p>
        </Link>
        <Link to="/convert" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10">
          <p className="text-sm font-medium">Compare</p>
          <p className="text-xs text-white/40 mt-1">See your provider's cost</p>
        </Link>
        <Link to="/monitor" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10">
          <p className="text-sm font-medium">Monitor</p>
          <p className="text-xs text-white/40 mt-1">Set a rate alert</p>
        </Link>
        <Link to="/plan" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10">
          <p className="text-sm font-medium">Plan a trip</p>
          <p className="text-xs text-white/40 mt-1">Estimate travel money</p>
        </Link>
      </div>
    </div>
  );
}