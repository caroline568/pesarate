import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRates, getCurrencyInfo, getWeather } from "../api";

const DESTINATIONS = ["USD", "GBP", "EUR", "AED", "INR"];

const STYLE_MULTIPLIER = { Budget: 0.8, Standard: 1, Comfortable: 1.4 };

const CATEGORY_SPLIT = [
  { name: "Accommodation", pct: 0.35 },
  { name: "Food", pct: 0.25 },
  { name: "Transport", pct: 0.15 },
  { name: "Activities", pct: 0.15 },
  { name: "Emergency", pct: 0.10 },
];

export default function Plan() {
  const [destination, setDestination] = useState("GBP");
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState(150000);
  const [style, setStyle] = useState("Standard");
  const [info, setInfo] = useState(null);
  const [rate, setRate] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const currencyInfo = await getCurrencyInfo(destination);
      if (cancelled) return;
      setInfo(currencyInfo);

      const kesData = await getRates("KES").catch(() => null);
      if (!cancelled && kesData) setRate(1 / kesData.rates?.[destination]);

      if (!cancelled && currencyInfo?.latlng) {
        const [lat, lon] = currencyInfo.latlng;
        const w = await getWeather(lat, lon);
        if (!cancelled) setWeather(w);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [destination]);

  const adjustedBudget = budget * STYLE_MULTIPLIER[style];
  const converted = rate ? adjustedBudget / rate : null;
  const dailyForeign = converted ? converted / days : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-medium mb-1">Planning a trip?</h1>
      <p className="text-white/50 text-sm mb-6">Know how much your money means before you go.</p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5 space-y-4">
        <div>
          <p className="text-xs text-white/40 uppercase mb-1">Destination</p>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {DESTINATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase mb-1">Trip duration (days)</p>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase mb-1">Estimated budget (KES)</p>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase mb-2">Travel style</p>
          <div className="flex gap-2">
            {Object.keys(STYLE_MULTIPLIER).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`flex-1 text-xs py-1.5 rounded-lg ${
                  style === s ? "bg-lime-400 text-black font-medium" : "bg-white/10 text-white/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {weather && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 flex items-center gap-3">
          <i className="ti ti-cloud text-xl text-white/40" />
          <p className="text-sm text-white/60">
            {info?.capital ? `${info.capital}: ` : ""}{Math.round(weather.temperature)}°C right now
          </p>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
        <p className="text-xs text-white/40 uppercase mb-3">Estimated trip budget</p>
        <p className="text-2xl font-medium mb-1">KES {adjustedBudget.toLocaleString()}</p>
        <p className="text-sm text-white/50 mb-4">
          &asymp; {converted ? `${destination} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "…"}
        </p>
        <p className="text-xs text-white/40">
          Daily budget: &asymp; {dailyForeign ? `${destination} ${dailyForeign.toFixed(2)}` : "…"}/day
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
        <p className="text-xs text-white/40 uppercase mb-3">Planning estimates, not actual prices</p>
        <div className="space-y-2">
          {CATEGORY_SPLIT.map((c) => (
            <div key={c.name} className="flex justify-between text-sm">
              <span className="text-white/60">{c.name}</span>
              <span>KES {(adjustedBudget * c.pct).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/monitor"
        className="inline-flex items-center gap-2 text-sm text-lime-400 hover:text-lime-300"
      >
        <i className="ti ti-bell text-base" />
        Monitor {destination}/KES
      </Link>
    </div>
  );
}