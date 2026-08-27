import { useState } from "react";
import { Bell, Plus, Trash2, TrendingUp } from "lucide-react";
import { useLocalCollection } from "../hooks/useLocalCollection";
import PageHeader from "../components/PageHeader";
import { Card, CardEyebrow } from "../components/Card";
import { EmptyState } from "../components/DataState";

const PAIR_OPTIONS = ["USD/KES", "GBP/KES", "EUR/KES", "AED/KES"];

export default function Monitor() {
  const { items: alerts, add, remove } = useLocalCollection("pesarate-alerts");
  const [pair, setPair] = useState(PAIR_OPTIONS[0]);
  const [target, setTarget] = useState(130);

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Watchlist"
        title="Watch the rates that matter."
        description="Set decision points for currencies you actually care about."
      />

      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex gap-3">
            <Bell className="text-lime" />
            <div>
              <h2 className="font-semibold">Create a rate alert</h2>
              <p className="mt-1 text-xs text-paper/50">
                PesaRate will use this as a target to help you decide when to look again.
              </p>
            </div>
          </div>
          <label className="mt-6 block text-xs text-paper/50">Currency pair</label>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="mt-2 w-full rounded-xl bg-paper/[0.06] p-3 font-medium outline-none"
          >
            {PAIR_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <label className="mt-4 block text-xs text-paper/50">Target rate</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="mt-2 w-full rounded-xl bg-paper/[0.06] p-3 outline-none font-[family-name:var(--font-mono)]"
          />
          <button
            onClick={() => add({ pair, target })}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3 text-sm font-semibold text-ink"
          >
            <Plus size={16} /> Add to watchlist
          </button>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between">
            <div>
              <CardEyebrow>Your decision points</CardEyebrow>
              <h2 className="mt-1 font-semibold">Active alerts</h2>
            </div>
            <TrendingUp size={18} className="text-lime" />
          </div>
          {alerts.length ? (
            <div className="mt-5 space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-center gap-4 rounded-xl bg-paper/[0.06] p-4">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-paper text-ink"><Bell size={15} /></div>
                  <div className="flex-1">
                    <b>{a.pair}</b>
                    <p className="mt-1 text-xs text-paper/50">Target: {a.target}</p>
                  </div>
                  <button onClick={() => remove(a.id)} aria-label={`Remove ${a.pair} alert`} className="text-coral">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState icon={Bell} title="No alerts yet" hint="Add the rates that matter to your next money decision." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
