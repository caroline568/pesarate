import { useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Plane } from "lucide-react";
import { useRates } from "../hooks/useRates";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";
import { ErrorState } from "../components/DataState";

const DESTINATIONS = [
  { city: "Dubai", code: "AED", days: 7, flag: "🇦🇪" },
  { city: "London", code: "GBP", days: 7, flag: "🇬🇧" },
  { city: "New York", code: "USD", days: 7, flag: "🇺🇸" },
  { city: "Dar es Salaam", code: "TZS", days: 5, flag: "🇹🇿" },
];

const SPLIT = [
  ["Accommodation", 0.35],
  ["Food", 0.2],
  ["Transport", 0.1],
  ["Activities", 0.2],
  ["Emergency", 0.15],
];

export default function TravelMoney() {
  const [budget, setBudget] = useState(150000);
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const { rates, status, reload } = useRates("KES");

  const foreign = budget * (rates?.[destination.code] || 0);
  const daily = foreign / destination.days;

  return (
    <div>
      <PageHeader
        eyebrow="Travel money"
        title="Turn your budget into a trip plan."
        description="See what your money is worth at your destination — and what that means for each day of the trip."
      />

      {status === "error" && <ErrorState onRetry={reload} />}

      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="ticket relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/40">Trip budget</p>
                <h2 className="mt-2 text-2xl font-semibold">How much are you taking?</h2>
              </div>
              <Plane className="text-lime" />
            </div>
            <div className="mt-7 rounded-2xl bg-paper/[0.07] p-5">
              <p className="text-xs text-paper/45">Budget in Kenya</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-bold text-lime">KES</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  className="w-full bg-transparent font-[family-name:var(--font-mono)] text-4xl font-semibold outline-none"
                />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-paper/[0.07] p-4">
                <p className="text-xs text-paper/40">Destination</p>
                <select
                  value={destination.city}
                  onChange={(e) => setDestination(DESTINATIONS.find((d) => d.city === e.target.value))}
                  className="mt-2 w-full bg-transparent font-semibold outline-none"
                >
                  {DESTINATIONS.map((d) => <option className="text-ink" key={d.city}>{d.city}</option>)}
                </select>
              </div>
              <div className="rounded-2xl bg-paper/[0.07] p-4">
                <p className="text-xs text-paper/40">Trip length</p>
                <p className="mt-2 text-lg font-semibold">{destination.days} days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-paper/60">
              <span className="text-xl">{destination.flag}</span>
              <MapPin size={16} /> {destination.city}
            </div>
            <div className="mt-5 font-[family-name:var(--font-mono)] text-4xl font-semibold">
              {foreign ? foreign.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}{" "}
              <span className="text-base text-paper/45">{destination.code}</span>
            </div>
            <p className="mt-2 text-sm text-paper/55">
              ≈ {daily ? daily.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"} {destination.code} available per day.
            </p>
          </Card>

          <Card className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/40">Suggested split</p>
            <div className="mt-4 space-y-3">
              {SPLIT.map(([name, p]) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{name}</span>
                    <b>{Math.round(p * 100)}%</b>
                  </div>
                  <div className="h-2 rounded-full bg-paper/10">
                    <div className="h-2 rounded-full bg-marigold" style={{ width: `${p * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex items-center gap-3 p-5">
            <CalendarDays className="text-lime" size={19} />
            <div>
              <p className="text-sm font-semibold">Planning a real trip?</p>
              <p className="mt-1 text-xs text-paper/50">Save this budget and monitor the destination rate.</p>
            </div>
            <ArrowRight size={16} className="ml-auto" />
          </Card>
        </div>
      </div>
    </div>
  );
}
