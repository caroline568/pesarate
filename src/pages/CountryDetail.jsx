import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRates, getCurrencyInfo, getWeather } from "../api";

export default function CountryDetail() {
  const { code } = useParams();
  const [info, setInfo] = useState(null);
  const [rate, setRate] = useState(null);
  const [weather, setWeather] = useState(null);
  const [amount, setAmount] = useState(100000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const currencyInfo = await getCurrencyInfo(code);
      if (cancelled) return;
      setInfo(currencyInfo);

      const kesData = await getRates("KES").catch(() => null);
      if (!cancelled && kesData) {
        setRate(1 / kesData.rates?.[code]);
      }

      if (!cancelled && currencyInfo?.latlng) {
        const [lat, lon] = currencyInfo.latlng;
        const w = await getWeather(lat, lon);
        if (!cancelled) setWeather(w);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [code]);

  const converted = rate ? amount / rate : null; // KES -> foreign currency

  return (
    <div className="max-w-lg">
      <Link to="/explore" className="text-xs text-white/40 hover:text-white/70 mb-4 inline-block">
        &larr; Back to Explore
      </Link>

      {loading && <p className="text-white/50 text-sm">Loading...</p>}

      {!loading && info && (
        <>
          <div className="flex items-center gap-3 mb-1">
            {info.flag && <img src={info.flag} alt="" className="w-8 h-6 object-cover rounded-sm" />}
            <h1 className="text-2xl font-medium">{info.country}</h1>
          </div>
          <p className="text-white/50 text-sm mb-6">{code} &middot; {info.currencyName} &middot; {info.region}</p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
            <p className="text-xs text-white/40 uppercase mb-1">Current exchange rate</p>
            <p className="text-2xl font-medium">1 {code} &asymp; {rate ? (1 / rate).toFixed(2) : "…"} KES</p>
          </div>

          {weather && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase mb-1">Weather in {info.capital}</p>
                <p className="text-lg font-medium">{Math.round(weather.temperature)}°C</p>
              </div>
              <i className="ti ti-cloud text-2xl text-white/40" />
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase mb-3">If you're travelling from Kenya</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent text-xl font-medium outline-none mb-2 w-full"
            />
            <p className="text-sm text-white/60">
              KES {amount.toLocaleString()} &asymp; {converted ? `${code} ${converted.toFixed(2)}` : "…"}
            </p>
          </div>

          <Link
            to="/monitor"
            className="mt-5 inline-flex items-center gap-2 text-sm text-lime-400 hover:text-lime-300"
          >
            <i className="ti ti-bell text-base" />
            Monitor {code}/KES
          </Link>
        </>
      )}
    </div>
  );
}