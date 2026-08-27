import { Link } from "react-router-dom";
import { ArrowRight, Bell, CalendarDays, CircleHelp, Plane, Save, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRates } from "../hooks/useRates";
import { useLocalCollection } from "../hooks/useLocalCollection";
import { Card, CardEyebrow } from "../components/Card";
import { LoadingGrid, ErrorState, EmptyState } from "../components/DataState";

const PAIRS = ["USD", "GBP", "EUR", "AED"];

export default function Dashboard() {
  const [amount, setAmount] = useState(250000);
  const [to, setTo] = useState("USD");
  const { rates, status, reload } = useRates("KES");
  const { items: saved, add: addSaved } = useLocalCollection("pesarate-saved", { limit: 5 });

  const rate = rates?.[to];
  const converted = rate ? amount * rate : null;

  const saveConversion = () => {
    addSaved({ amount, to, from: "KES", rate, value: converted });
  };

  return (
    <div>
      <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <CardEyebrow>Good morning</CardEyebrow>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium sm:text-4xl">
            Your money, understood.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-paper/55">
            The answer is the rate. The value is the context around it.
          </p>
        </div>
        <Link to="/money" className="text-sm font-medium text-lime">
          Open full converter <ArrowRight className="inline ml-1" size={14} />
        </Link>
      </section>

      {status === "error" ? (
        <ErrorState message="Live rates didn't load." onRetry={reload} />
      ) : (
        <section className="grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
          <Card className="overflow-hidden" denom="₮">
            {status === "loading" ? (
              <div className="p-6"><LoadingGrid count={1} /></div>
            ) : (
              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <CardEyebrow>Live conversion</CardEyebrow>
                    <h2 className="mt-1 text-lg font-semibold">What is my money worth?</h2>
                  </div>
                  <span className="rounded-full bg-marigold/15 px-3 py-1.5 font-mono text-[10px] font-semibold text-marigold">
                    MID-MARKET
                  </span>
                </div>

                <div className="mt-7 grid items-center gap-3 md:grid-cols-[1fr_60px_1fr]">
                  <div className="rounded-2xl bg-paper/[0.06] p-4">
                    <p className="text-xs text-paper/45">You have</p>
                    <div className="mt-2 flex items-center gap-3">
                      <b className="rounded-lg bg-paper px-2.5 py-2 text-xs text-ink">KES</b>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value) || 0)}
                        type="number"
                        className="w-full bg-transparent font-[family-name:var(--font-mono)] text-2xl font-semibold outline-none"
                      />
                    </div>
                  </div>
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-lime text-ink">→</div>
                  <div className="rounded-2xl bg-paper/[0.06] p-4">
                    <p className="text-xs text-paper/45">You receive</p>
                    <div className="mt-2 flex items-center gap-3">
                      <select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="rounded-lg bg-paper px-2.5 py-2 text-xs font-bold text-ink outline-none"
                      >
                        {PAIRS.map((x) => <option key={x}>{x}</option>)}
                      </select>
                      <b className="font-[family-name:var(--font-mono)] text-2xl">
                        {converted ? converted.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                      </b>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-ink p-5">
                  <div className="flex gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/40">What this means</p>
                      <p className="mt-2 text-sm leading-relaxed text-paper/70">
                        Your conversion uses the live mid-market rate. Provider fees or markups can
                        reduce the amount you actually receive.
                      </p>
                    </div>
                    <CircleHelp size={18} className="shrink-0 text-lime" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs">
                    <span className="rounded-lg bg-paper/10 px-3 py-2 font-mono">
                      1 KES ≈ {rate ? rate.toFixed(5) : "—"} {to}
                    </span>
                    <button
                      onClick={saveConversion}
                      className="inline-flex items-center gap-2 rounded-lg bg-lime px-3 py-2 font-semibold text-ink"
                    >
                      <Save size={14} /> Save conversion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardEyebrow>Decision context</CardEyebrow>
                <h2 className="mt-1 text-lg font-semibold">Before you exchange</h2>
              </div>
              <Bell size={18} className="text-lime" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-paper/[0.06] p-4">
                <p className="text-xs text-paper/45">Rate signal</p>
                <div className="mt-2 flex items-center gap-2 font-semibold">
                  <TrendingUp size={17} className="text-lime" /> Monitor the pair before a large transfer
                </div>
                <p className="mt-2 text-xs text-paper/50">
                  Use Watchlist to set a target rate and get a decision point.
                </p>
              </div>
              <div className="rounded-xl bg-paper/[0.06] p-4">
                <p className="text-xs text-paper/45">Travel</p>
                <div className="mt-2 flex items-center gap-2 font-semibold">
                  <Plane size={17} /> Planning a trip?
                </div>
                <Link to="/travel" className="mt-2 inline-block text-xs text-lime">
                  Build a travel money plan →
                </Link>
              </div>
              <div className="rounded-xl border border-dashed border-line p-4">
                <p className="text-xs text-paper/45">Tip</p>
                <p className="mt-1 text-sm font-medium">Compare the amount you receive, not just the advertised fee.</p>
              </div>
            </div>
          </Card>
        </section>
      )}

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <CardEyebrow>Watchlist</CardEyebrow>
              <h2 className="mt-1 font-semibold">Important currencies</h2>
            </div>
            <Link to="/monitor" className="text-xs text-lime">Manage →</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PAIRS.map((x, i) => (
              <div key={x} className="flex items-center justify-between rounded-xl border border-line p-4">
                <div>
                  <b>KES/{x}</b>
                  <p className="mt-1 text-[11px] text-paper/40">Live market pair</p>
                </div>
                {i % 2 ? <TrendingDown size={16} className="text-coral" /> : <TrendingUp size={16} className="text-lime" />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <CardEyebrow>Saved conversions</CardEyebrow>
              <h2 className="mt-1 font-semibold">Your important numbers</h2>
            </div>
            <CalendarDays size={18} className="text-lime" />
          </div>
          {saved.length ? (
            <div className="mt-4 space-y-2">
              {saved.map((x) => (
                <div key={x.id} className="flex justify-between rounded-xl bg-paper/[0.06] p-3 text-sm">
                  <span>KES {x.amount.toLocaleString()} → {x.to}</span>
                  <b className="font-[family-name:var(--font-mono)]">
                    {x.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </b>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState icon={CalendarDays} title="No saved conversions yet" hint="Save conversions that matter to you." />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
