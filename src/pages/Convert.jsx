import { useState } from "react";
import { ArrowLeftRight, Save, ShieldCheck } from "lucide-react";
import { useRates } from "../hooks/useRates";
import { useLocalCollection } from "../hooks/useLocalCollection";
import { Card, CardEyebrow } from "../components/Card";
import PageHeader from "../components/PageHeader";
import { ErrorState } from "../components/DataState";

const CURRENCIES = ["KES", "USD", "EUR", "GBP", "AED", "TZS", "UGX", "ZAR"];
const COMPARE_POINTS = ["Mid-market rate", "Provider markup", "Fixed transfer fee", "Amount actually received"];

export default function Convert() {
  const [amount, setAmount] = useState(25000);
  const [from, setFrom] = useState("KES");
  const [to, setTo] = useState("USD");
  const { rates, status, reload } = useRates(from);
  const { add } = useLocalCollection("pesarate-saved", { limit: 10 });

  const rate = from === to ? 1 : rates?.[to];
  const result = rate ? amount * rate : null;
  const swap = () => { setFrom(to); setTo(from); };
  const save = () => add({ amount, to, from, rate, value: result });

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Convert"
        title="The number is only the beginning."
        description="Convert, compare the rate, then understand what you will actually receive."
      />

      {status === "error" && <ErrorState message="Rate unavailable right now." onRetry={reload} />}

      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Card className="p-5 sm:p-7">
          <div className="grid items-center gap-3 md:grid-cols-[1fr_52px_1fr]">
            <div className="rounded-2xl bg-paper/[0.06] p-5">
              <label className="text-xs text-paper/45">From</label>
              <div className="mt-2 flex gap-3">
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl bg-paper px-3 font-bold text-ink outline-none">
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full min-w-0 bg-transparent font-[family-name:var(--font-mono)] text-3xl font-semibold outline-none"
                />
              </div>
            </div>
            <button onClick={swap} aria-label="Swap currencies" className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-lime text-ink">
              <ArrowLeftRight size={17} />
            </button>
            <div className="rounded-2xl bg-paper/[0.06] p-5">
              <label className="text-xs text-paper/45">To</label>
              <div className="mt-2 flex items-center gap-3">
                <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-xl bg-paper px-3 py-3 font-bold text-ink outline-none">
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="truncate font-[family-name:var(--font-mono)] text-3xl font-semibold">
                  {result?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-ink p-6">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/40">Estimated value</p>
            <div className="mt-2 text-5xl font-semibold tracking-tight font-[family-name:var(--font-mono)]">
              {result?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "—"}{" "}
              <span className="text-base text-paper/40">{to}</span>
            </div>
            <div className="mt-4 text-sm text-paper/55">1 {from} = {rate ? rate.toFixed(6) : "—"} {to}</div>
            <button onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink">
              <Save size={15} /> Save this conversion
            </button>
          </div>
        </Card>

        <aside className="space-y-5">
          <Card className="p-5">
            <ShieldCheck size={19} className="text-lime" />
            <h3 className="mt-4 font-semibold">What to compare</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/60">
              {COMPARE_POINTS.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          </Card>
          <Card className="p-5">
            <CardEyebrow>PesaRate principle</CardEyebrow>
            <p className="mt-3 text-lg font-semibold">A low fee does not always mean a better deal.</p>
            <p className="mt-2 text-sm text-paper/55">The best comparison is the final amount in your hands.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
