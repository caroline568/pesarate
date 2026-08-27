import { RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { useRates } from "../hooks/useRates";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/Card";
import { LoadingGrid, ErrorState } from "../components/DataState";

const LIST = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR", "JPY"];
const SPARK = [25, 34, 28, 45, 38, 53, 48, 60];

export default function Rates() {
  const { rates, status, reload } = useRates("KES");

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

      {status === "error" && <ErrorState onRetry={reload} />}
      {status === "loading" && <LoadingGrid count={8} className="sm:grid-cols-2 xl:grid-cols-4" />}

      {status === "ready" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LIST.map((c, i) => (
            <Card key={c} className="p-5">
              <div className="flex justify-between">
                <b>KES/{c}</b>
                {i % 3 === 1 ? <TrendingDown className="text-coral" size={16} /> : <TrendingUp className="text-lime" size={16} />}
              </div>
              <div className="mt-5 font-[family-name:var(--font-mono)] text-2xl font-semibold">
                {rates[c] ? rates[c].toFixed(5) : "—"}
              </div>
              <p className="mt-2 text-xs text-paper/45">1 KES in {c}</p>
              <div className="mt-5 flex h-8 items-end gap-1">
                {SPARK.map((h, j) => (
                  <span key={j} className="flex-1 rounded-t bg-marigold/40" style={{ height: `${h}%` }} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
