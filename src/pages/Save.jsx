import { useState, useEffect } from "react";
import { getRates } from "../api";

const STORAGE_KEY = "pesarate_saved_pairs";
const DEFAULT_PAIRS = [
  { from: "USD", to: "KES" },
  { from: "GBP", to: "KES" },
];

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PAIRS;
  } catch {
    return DEFAULT_PAIRS;
  }
}

export default function Save() {
  const [pairs, setPairs] = useState(loadSaved);
  const [rates, setRates] = useState({});
  const [newFrom, setNewFrom] = useState("EUR");
  const [newTo, setNewTo] = useState("KES");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
  }, [pairs]);

  useEffect(() => {
    async function loadAll() {
      const results = {};
      for (const p of pairs) {
        try {
          const data = await getRates(p.from);
          results[`${p.from}${p.to}`] = data.rates?.[p.to] ?? null;
        } catch {
          results[`${p.from}${p.to}`] = null;
        }
      }
      setRates(results);
    }
    loadAll();
  }, [pairs]);

  function addPair() {
    if (newFrom === newTo) return;
    const exists = pairs.some((p) => p.from === newFrom && p.to === newTo);
    if (exists) return;
    setPairs([...pairs, { from: newFrom, to: newTo }]);
  }

  function removePair(from, to) {
    setPairs(pairs.filter((p) => !(p.from === from && p.to === to)));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-1">Your currencies.</h1>
      <p className="text-white/50 text-sm mb-6">Saved locally on this device.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {pairs.map((p) => {
          const rate = rates[`${p.from}${p.to}`];
          return (
            <div key={`${p.from}${p.to}`} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
              <button
                onClick={() => removePair(p.from, p.to)}
                className="absolute top-3 right-3 text-white/30 hover:text-red-400 text-xs"
              >
                <i className="ti ti-x" />
              </button>
              <p className="text-sm text-white/60 mb-1">{p.from} / {p.to}</p>
              <p className="text-xl font-medium">{rate ? rate.toFixed(2) : "…"}</p>
            </div>
          );
        })}
        {pairs.length === 0 && (
          <p className="text-white/40 text-sm col-span-2">No saved pairs yet — add one below.</p>
        )}
      </div>

      <div className="bg-white/5 border border-dashed border-white/15 rounded-xl p-4 flex items-center gap-3">
        <select value={newFrom} onChange={(e) => setNewFrom(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
          <option>USD</option><option>GBP</option><option>EUR</option><option>KES</option><option>INR</option><option>JPY</option>
        </select>
        <span className="text-white/40 text-sm">/</span>
        <select value={newTo} onChange={(e) => setNewTo(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
          <option>KES</option><option>USD</option><option>GBP</option><option>EUR</option>
        </select>
        <button
          onClick={addPair}
          className="ml-auto bg-lime-400 text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-lime-300"
        >
          Add
        </button>
      </div>
    </div>
  );
}