import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getHistoricalRange } from "../api";
import { EmptyState } from "./DataState";
import { CHARTABLE_CURRENCIES } from "../config/chartable-currencies";

const RANGES = ["1W", "1M", "3M", "1Y"];

/**
 * Real trend chart for a base/quote currency pair, backed by actual
 * historical rates (Frankfurter) rather than fabricated sparkline data.
 * Shows an honest empty state instead of a chart for unsupported pairs.
 */
export default function HistoricalChart({ base, quote }) {
  const [range, setRange] = useState("1M");
  const [data, setData] = useState(null);
  const [loadedKey, setLoadedKey] = useState(null);
  const key = `${base}-${quote}-${range}`;

  useEffect(() => {
    let cancelled = false;
    getHistoricalRange(base, quote, range).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoadedKey(key);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [base, quote, range, key]);

  const loading = loadedKey !== key;
  const unsupported = !CHARTABLE_CURRENCIES.includes(base) && !CHARTABLE_CURRENCIES.includes(quote);

  if (unsupported) {
    return (
      <EmptyState
        title={`No historical data source for ${base}/${quote}`}
        hint="Free market-data APIs don't publish history for this pair yet — pick a major currency (USD, GBP, EUR...) to see a real trend."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {data && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                data.changePercent >= 0 ? "bg-lime/15 text-lime" : "bg-coral/15 text-coral"
              }`}
            >
              {data.changePercent >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {data.changePercent >= 0 ? "+" : ""}
              {data.changePercent.toFixed(2)}%
            </span>
          )}
          <span className="text-xs text-paper/45">
            {base}/{quote} · {range === "1W" ? "past week" : range === "1M" ? "past month" : range === "3M" ? "past 3 months" : "past year"}
          </span>
        </div>
        <div className="flex gap-1 rounded-full bg-paper/[0.06] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                range === r ? "bg-lime text-ink" : "text-paper/55 hover:text-paper"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="ticket h-56 skeleton" />}

      {!loading && !data && (
        <EmptyState
          title="Not enough data points for this range"
          hint="Try a shorter or longer range, or a different currency."
        />
      )}

      {!loading && data && (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-lime)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-lime)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--color-paper)", opacity: 0.35, fontSize: 10 }}
                tickFormatter={(d) => d.slice(5)}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip
                contentStyle={{
                  background: "var(--color-ink-soft)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--color-paper)" }}
                formatter={(value) => [value.toFixed(5), `${base}/${quote}`]}
              />
              <Area type="monotone" dataKey="value" stroke="var(--color-lime)" strokeWidth={2} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
