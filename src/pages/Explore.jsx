import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRates, getCurrencyInfo } from "../api";

const CURRENCIES = ["USD", "GBP", "EUR", "INR", "JPY", "AED"];

export default function Explore() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const kesData = await getRates("KES").catch(() => null);
      const results = [];
      for (const code of CURRENCIES) {
        const info = await getCurrencyInfo(code);
        const rate = kesData ? 1 / kesData.rates?.[code] : null; // 1 X = ? KES
        results.push({ code, ...info, rateToKES: rate });
      }
      setCountries(results);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = countries.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-medium mb-1">Explore money around the world.</h1>
      <p className="text-white/50 text-sm mb-6">Live rates against the Kenyan Shilling.</p>

      <input
        type="text"
        placeholder="Search a country or currency"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none mb-6"
      />

      {loading && <p className="text-white/50 text-sm">Loading countries...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Link
            key={c.code}
            to={`/explore/${c.code}`}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-lime-400/30 hover:bg-lime-400/5 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              {c.flag ? (
                <img src={c.flag} alt="" className="w-6 h-4 object-cover rounded-sm" />
              ) : (
                <span className="w-6 h-4 bg-white/10 rounded-sm" />
              )}
              <span className="text-sm font-medium">{c.country || c.code}</span>
            </div>
            <p className="text-xs text-white/40 mb-1">{c.code}</p>
            <p className="text-sm font-medium">
              1 {c.code} = {c.rateToKES ? c.rateToKES.toFixed(2) : "…"} KES
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-2">
        {["🇰🇪", "Kenya", "·", "KES", "·", "Your home currency"].map((t, i) => (
          <span key={i} className="text-sm text-white/50">{t}</span>
        ))}
      </div>
    </div>
  );
}