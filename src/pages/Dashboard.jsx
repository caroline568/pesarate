import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRates } from "../api";
import { Card } from "../components/Card";

const PAIRS = [
  { from: "USD", to: "KES" },
  { from: "GBP", to: "KES" },
  { from: "EUR", to: "KES" },
];

const QUICK_ACTIONS = [
  { to: "/convert", title: "Convert", desc: "Check a conversion" },
  { to: "/convert", title: "Compare", desc: "See your provider's cost" },
  { to: "/monitor", title: "Monitor", desc: "Set a rate alert" },
  { to: "/plan", title: "Plan a trip", desc: "Estimate travel money" },
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
    <div className="max-w-4xl font-display">
      <h1 className="text-2xl font-medium mb-1 tracking-tight">Good morning.</h1>
      <p className="text-white/50 text-sm mb-8">Here's what your money is doing today.</p>

      <p className="text-xs text-white/40 uppercase tracking-wide mb-3">Live market snapshot</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {PAIRS.map((p) => {
          const key = `${p.from}${p.to}`;
          const rate = rates[key];
          return (
            <Card key={key} className="p-4">
              <p className="text-sm text-white/60 mb-1">{p.from} / {p.to}</p>
              <p className="text-xl font-medium tabular-nums">
                {loading ? "…" : rate ? rate.toFixed(2) : "—"}
              </p>
              <p className="text-xs text-white/40 mt-1">Live from open.er-api.com</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 mb-6">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Your money</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="bg-transparent text-2xl font-medium tabular-nums outline-none mb-3 w-full focus:text-accent transition-colors"
        />
        <div className="flex gap-6 text-sm text-white/70">
          <p>
            ≈ USD{" "}
            <span className="text-white tabular-nums">
              {rates.KESUSD ? (amount * rates.KESUSD).toFixed(2) : "—"}
            </span>
          </p>
          <p>
            ≈ GBP{" "}
            <span className="text-white tabular-nums">
              {rates.KESGBP ? (amount * rates.KESGBP).toFixed(2) : "—"}
            </span>
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ to, title, desc }) => (
          <Link key={title} to={to}>
            <Card className="p-4 h-full hover:bg-white/6 hover:border-accent/30 transition">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-white/40 mt-1">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}