import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRates } from "../hooks/useRates";
import PageHeader from "../components/PageHeader";
import { Card, CardEyebrow } from "../components/Card";
import { LoadingGrid, ErrorState } from "../components/DataState";
import HistoricalChart from "../components/HistoricalChart";
import { CHARTABLE_CURRENCIES } from "../config/chartable-currencies";

const LIST = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR", "JPY"];

export default function Rates() {
  const { rates, status, reload } = useRates("KES");
  const [chartQuote, setChartQuote] = useState("USD");

  return (
    <div>
      <PageHeader
        eyebrow="Market rates"
        title="The market, with context."
        description="Live mid-market rates from KES. Use them as a benchmark, not a promise of what a provider will pay."
        action={
          <button onClick={reload} className="rounded-xl border border-line p-3" aria-label="Refresh rates">
            <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} />
          </button>
        }
      />

      <Card className="mb-5 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardEyebrow>Historical trend</CardEyebrow>
            <h2 className="mt-1 font-semibold">Is it rising or falling?</h2>
          </div>
          <select
            value={chartQuote}
            onChange={(e) => setChartQuote(e.target.value)}
            className="rounded-lg bg-paper px-2.5 py-2 text-xs font-bold text-ink outline-none"
          >
            {CHARTABLE_CURRENCIES.filter((c) => c !== "EUR").map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <HistoricalChart base={chartQuote} quote="EUR" />
        </div>
        <p className="mt-3 text-[11px] text-paper/40">
          Charted against EUR (our free historical source doesn't track KES) — still shows real movement, not a
          placeholder.
        </p>
      </Card>

      {status === "error" && <ErrorState onRetry={reload} />}
      {status === "loading" && <LoadingGrid count={8} className="sm:grid-cols-2 xl:grid-cols-4" />}

      {status === "ready" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LIST.map((c) => (
            <Card key={c} className="p-5">
              <b>KES/{c}</b>
              <div className="mt-5 font-[family-name:var(--font-mono)] text-2xl font-semibold">
                {rates[c] ? rates[c].toFixed(5) : "—"}
              </div>
              <p className="mt-2 text-xs text-paper/45">1 KES in {c}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
