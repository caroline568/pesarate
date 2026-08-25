import { useState, useEffect } from "react";
import { getRates } from "../api";

const STORAGE_KEY = "pesarate_rate_alerts";

function loadAlerts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Monitor() {
  const [alerts, setAlerts] = useState(loadAlerts);
  const [currentRates, setCurrentRates] = useState({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState("above");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

 useEffect(() => {
  async function checkAll() {
    const results = {};
    const pairs = [...new Set(alerts.map((a) => `${a.from}-${a.to}`))];
    for (const pair of pairs) {
      const [f, t] = pair.split("-");
      try {
        const data = await getRates(f);
        results[pair] = data.rates?.[t] ?? null;
      } catch {
        results[pair] = null;
      }
    }
    setCurrentRates(results);
  }
  if (alerts.length > 0) checkAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [alerts.map((a) => `${a.from}-${a.to}`).join(",")]);

  function createAlert() {
    const parsed = parseFloat(target);
    if (!parsed || parsed <= 0) return;
    setAlerts([
      ...alerts,
      { id: Date.now(), from, to, target: parsed, direction, active: true },
    ]);
    setTarget("");
  }

  function toggleActive(id) {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }

  function deleteAlert(id) {
    setAlerts(alerts.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-1">Don't constantly check the rate.</h1>
      <p className="text-white/50 text-sm mb-6">Let PesaRate watch it for you.</p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <p className="text-sm text-white/60 mb-3">Create an alert</p>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option>USD</option><option>GBP</option><option>EUR</option>
          </select>
          <span className="text-white/40">/</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option>KES</option><option>USD</option><option>EUR</option>
          </select>
          <select value={direction} onChange={(e) => setDirection(e.target.value)} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option value="above">reaches above</option>
            <option value="below">falls below</option>
          </select>
          <input
            type="number"
            placeholder="Target rate"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-white/10 rounded-lg px-3 py-1.5 text-sm w-28 outline-none"
          />
        </div>
        <button
          onClick={createAlert}
          className="bg-lime-400 text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-lime-300"
        >
          Create Alert
        </button>
      </div>

      <p className="text-xs text-white/40 uppercase mb-3">Active alerts</p>
      <div className="space-y-3">
        {alerts.length === 0 && (
          <p className="text-white/40 text-sm">No alerts yet — create one above.</p>
        )}
        {alerts.map((a) => {
          const current = currentRates[`${a.from}-${a.to}`];
          const triggered =
            current != null &&
            (a.direction === "above" ? current >= a.target : current <= a.target);
          return (
            <div key={a.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{a.from} / {a.to}</p>
                <p className="text-xs text-white/40">
                  Alert when {a.direction} {a.target}
                  {current != null && <> &middot; now {current.toFixed(2)}</>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {triggered && a.active && (
                  <span className="text-xs text-lime-400">Target reached</span>
                )}
                <span className={`text-xs ${a.active ? "text-lime-400" : "text-white/30"}`}>
                  <i className="ti ti-circle-filled text-[8px] align-middle mr-1" />
                  {a.active ? "Monitoring" : "Paused"}
                </span>
                <button onClick={() => toggleActive(a.id)} className="text-white/40 hover:text-white text-xs">
                  {a.active ? "Pause" : "Resume"}
                </button>
                <button onClick={() => deleteAlert(a.id)} className="text-white/40 hover:text-red-400 text-xs">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/30 mt-6">
        Alerts check the live rate while this page is open — push notifications aren't implemented in this MVP.
      </p>
    </div>
  );
}