import { useState, useEffect } from "react";
import { getRates } from "../api";

function fairnessLabel(diffPercent) {
  const abs = Math.abs(diffPercent);
  if (abs < 1) return { label: "Fair", color: "text-lime-400", dot: "🟢" };
  if (abs < 3) return { label: "Slight markup", color: "text-yellow-400", dot: "🟡" };
  if (abs < 6) return { label: "High markup", color: "text-orange-400", dot: "🟠" };
  return { label: "Very high markup", color: "text-red-400", dot: "🔴" };
}

export default function Convert() {
  const [amount, setAmount] = useState(25000);
  const [from, setFrom] = useState("KES");
  const [to, setTo] = useState("USD");
  const [rate, setRate] = useState(null);
  const [providerRate, setProviderRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRates(from);
        if (!cancelled) setRate(data.rates?.[to] ?? null);
      } catch {
        if (!cancelled) setError("Couldn't fetch the rate. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [from, to]);

  const converted = rate ? amount * rate : null;
  const parsedProvider = parseFloat(providerRate);
  const hasProvider = providerRate !== "" && !isNaN(parsedProvider) && parsedProvider > 0;
  const providerConverted = hasProvider ? amount * parsedProvider : null;
  const lossAmount = hasProvider && converted ? converted - providerConverted : null;
  const diffPercent = hasProvider && rate ? ((parsedProvider - rate) / rate) * 100 : null;
  const fairness = diffPercent !== null ? fairnessLabel(diffPercent) : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-medium mb-6">What is my money worth?</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-transparent text-2xl font-medium outline-none flex-1"
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option>KES</option><option>USD</option><option>GBP</option><option>EUR</option>
          </select>
        </div>
        <p className="text-white/40 text-sm mb-1">↓</p>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-medium">
            {loading ? "…" : converted !== null ? converted.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
          </p>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm ml-auto">
            <option>USD</option><option>KES</option><option>GBP</option><option>EUR</option>
          </select>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {rate && <p className="text-white/40 text-xs mt-3">Live mid-market rate: 1 {from} = {rate.toFixed(5)} {to}</p>}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <p className="text-sm text-white/60 mb-2">What your provider offers</p>
        <input
          type="number"
          placeholder="Enter provider rate"
          value={providerRate}
          onChange={(e) => setProviderRate(e.target.value)}
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none mb-4"
        />

        {hasProvider && lossAmount !== null && (
          <>
            <p className="text-xs text-white/40 mb-1">
              {lossAmount > 0 ? "You could be losing" : "You're getting a fair or better deal"}
            </p>
            {lossAmount > 0 && (
              <p className="text-3xl font-medium text-red-400 mb-2">
                {to} {Math.abs(lossAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            )}
            <p className="text-xs text-white/40 mb-3">{diffPercent.toFixed(1)}% {diffPercent < 0 ? "below" : "above"} mid-market</p>

            {fairness && (
              <p className={`text-sm font-medium ${fairness.color}`}>{fairness.dot} {fairness.label}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}