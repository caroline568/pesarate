import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CloudSun, Plane, WalletCards } from "lucide-react";
import { getRates, getCurrencyInfo, getWeather } from "../api";
import { Card } from "../components/Card";
import { LoadingGrid, ErrorState } from "../components/DataState";

export default function CountryDetail() {
  const { code } = useParams();
  const [info, setInfo] = useState(null);
  const [rate, setRate] = useState(null);
  const [weather, setWeather] = useState(null);
  const [amount, setAmount] = useState(100000);
  const [error, setError] = useState(false);
  const [loadedFor, setLoadedFor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const currencyInfo = await getCurrencyInfo(code);
        if (cancelled) return;
        if (!currencyInfo) {
          setError(true);
          setLoadedFor(code);
          return;
        }
        setInfo(currencyInfo);
        setError(false);

        const rates = await getRates("KES").catch(() => null);
        if (!cancelled) setRate(rates?.rates?.[code] || null);

        if (currencyInfo.latlng) {
          const w = await getWeather(...currencyInfo.latlng);
          if (!cancelled) setWeather(w);
        }
        if (!cancelled) setLoadedFor(code);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoadedFor(code);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const status = error ? "error" : loadedFor === code ? "ready" : "loading";

  const converted = rate ? amount * rate : null;

  return (
    <div className="max-w-4xl">
      <Link to="/explore" className="inline-flex items-center gap-2 text-xs text-paper/50">
        <ArrowLeft size={14} /> Explore
      </Link>

      {status === "loading" && <div className="mt-5"><LoadingGrid count={2} /></div>}
      {status === "error" && <div className="mt-5"><ErrorState message="Couldn't load this country's details." /></div>}

      {status === "ready" && info && (
        <>
          <div className="mt-5 flex items-center gap-3">
            <img src={info.flag} alt={`${info.country} flag`} className="h-6 w-9 rounded object-cover" />
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium">{info.country}</h1>
              <p className="text-sm text-paper/50">{code} · {info.currencyName} · {info.region}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Card className="p-5 md:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/40">Current benchmark</p>
              <div className="mt-3 font-[family-name:var(--font-mono)] text-4xl font-semibold">
                1 {code} ≈ {rate ? `KES ${(1 / rate).toFixed(2)}` : "—"}
              </div>
              <p className="mt-2 text-sm text-paper/50">Mid-market reference rate</p>
            </Card>
            <Card className="p-5">
              {weather ? (
                <>
                  <CloudSun className="text-lime" />
                  <p className="mt-4 text-xs text-paper/50">{info.capital}</p>
                  <b className="text-2xl">{Math.round(weather.temperature)}°C</b>
                </>
              ) : (
                <Plane />
              )}
              <p className="mt-2 text-xs text-paper/45">Useful travel context</p>
            </Card>
          </div>

          <Card className="mt-5 p-6">
            <div className="flex items-center gap-2">
              <WalletCards size={18} className="text-lime" />
              <h2 className="font-semibold">If you're travelling from Kenya</h2>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-5 w-full rounded-xl bg-paper/[0.06] p-4 font-[family-name:var(--font-mono)] text-2xl font-semibold outline-none"
            />
            <p className="mt-3 text-sm text-paper/60">
              KSh {amount.toLocaleString()} ≈ {converted ? `${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${code}` : "—"}
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
