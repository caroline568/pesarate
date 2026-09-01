import { useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Edit3, Pause, Play, Plus, Trash2, X } from "lucide-react";
import { getRates } from "../api";
import { useRateAlerts } from "../hooks/useRateAlerts";
import { useRates } from "../hooks/useRates";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";

const CURRENCIES = ["KES", "USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR"];

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(Number(value))) return "—";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export default function Alerts() {
  const { items, add, update, remove, error } = useRateAlerts();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [alertRates, setAlertRates] = useState({});
  const [notification, setNotification] = useState(null);
  const [notifiedIds, setNotifiedIds] = useState(() => new Set());
  const [form, setForm] = useState({ from_currency: "USD", to_currency: "KES", target_rate: 130 });
  const { rates } = useRates(form.from_currency);

  useEffect(() => {
    const activeAlerts = items.filter((alert) => alert.active);
    const bases = [...new Set(activeAlerts.map((alert) => alert.from_currency))];
    if (!bases.length) return undefined;

    let cancelled = false;
    const checkAlerts = async () => {
      const responses = await Promise.allSettled(bases.map((base) => getRates(base)));
      if (cancelled) return;
      const nextRates = {};
      responses.forEach((result, index) => {
        if (result.status === "fulfilled") nextRates[bases[index]] = result.value.rates || {};
      });
      setAlertRates(nextRates);

      const reached = activeAlerts.find((alert) => {
        const liveRate = Number(nextRates[alert.from_currency]?.[alert.to_currency] || 0);
        return liveRate >= Number(alert.target_rate) && !notifiedIds.has(alert.id);
      });
      if (reached) {
        const liveRate = Number(nextRates[reached.from_currency]?.[reached.to_currency]);
        setNotification({ ...reached, liveRate });
        setNotifiedIds((current) => new Set(current).add(reached.id));
      }
    };

    checkAlerts();
    const interval = window.setInterval(checkAlerts, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [items, notifiedIds]);

  const currentRate = Number(rates?.[form.to_currency] || 0);
  const distance = Number(form.target_rate) - currentRate;
  const comparisonLabel = useMemo(() => {
    if (!currentRate) return "We need a live rate to compare your target.";
    if (distance > 0) return `Your target is ${formatNumber(distance, 2)} ${form.to_currency} above the current rate.`;
    if (distance < 0) return `Your target is ${formatNumber(Math.abs(distance), 2)} ${form.to_currency} below the current rate.`;
    return `The current rate matches your target exactly.`;
  }, [currentRate, distance, form.to_currency]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      target_rate: Number(form.target_rate),
      from_currency: form.from_currency,
      to_currency: form.to_currency,
    };

    if (editing) {
      await update(editing.id, payload);
    } else {
      await add(payload);
    }
    setOpen(false);
    setEditing(null);
  };

  const edit = (alert) => {
    setEditing(alert);
    setForm({ from_currency: alert.from_currency, to_currency: alert.to_currency, target_rate: alert.target_rate });
    setOpen(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Alerts"
        title="Stay ahead of rate moves"
        description="Tell us when the rate is good enough for you to act."
        action={
          <button onClick={() => { setEditing(null); setForm({ from_currency: "USD", to_currency: "KES", target_rate: 130 }); setOpen(true); }} className="flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white">
            <Plus size={14} /> New alert
          </button>
        }
      />

      {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">{error}</p>}

      {notification && (
        <div role="status" className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-[#bce8b7] bg-[#f0faee] p-3 text-xs text-slate-700">
          <div className="flex gap-2">
            <BellRing size={16} className="mt-0.5 shrink-0 text-[#43b34d]" />
            <p><strong>{notification.from_currency}/{notification.to_currency} alert reached.</strong> The rate is now {formatNumber(notification.liveRate, 3)} {notification.to_currency}, at or above your target of {formatNumber(notification.target_rate, 2)}.</p>
          </div>
          <button aria-label="Dismiss notification" onClick={() => setNotification(null)} className="shrink-0 text-slate-500"><X size={14} /></button>
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[.72fr_1.28fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-500">
              <Bell size={16} />
            </span>
            <div>
              <p className="text-[10px] font-bold">Create a rate alert</p>
              <p className="text-[9px] text-slate-400">We’ll tell you when the rate reaches your target.</p>
            </div>
          </div>

          <button onClick={() => setOpen(true)} className="mt-6 w-full rounded-lg border border-slate-200 py-3 text-[10px] font-semibold text-slate-700">
            Choose currency pair
          </button>

          <div className="mt-6 rounded-xl bg-slate-50 p-3">
            <p className="text-[9px] text-slate-400">Current rate</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              1 {form.from_currency} = {formatNumber(currentRate, 3)} {form.to_currency}
            </p>
            <p className="mt-2 text-[10px] leading-5 text-slate-600">{comparisonLabel}</p>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-[10px] font-bold">Your alerts</p>
              <p className="mt-1 text-[9px] text-slate-400">Simple targets based on the rate you care about.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((alert) => {
              const alertRate = Number(alert.target_rate || 0);
              const alertCurrent = Number(alertRates[alert.from_currency]?.[alert.to_currency] || (alert.from_currency === form.from_currency ? rates?.[alert.to_currency] : 0));
              const alertGap = alertRate - alertCurrent;

              return (
                <div key={alert.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800">
                      {alert.from_currency} reaches {alert.to_currency} {formatNumber(alertRate, 2)}
                    </p>
                    <p className="mt-1 text-[8px] text-slate-400">
                      Current rate: {formatNumber(alertCurrent, 3)} {alert.to_currency} · {alertGap >= 0 ? "Target is above current" : "Target is below current"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => edit(alert)} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => update(alert.id, { ...alert, active: !alert.active })} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600">
                      {alert.active ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button onClick={() => remove(alert.id)} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {!items.length && <p className="p-6 text-center text-[9px] text-slate-400">No alerts yet. Add one to monitor the rate.</p>}
          </div>
        </Card>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/25 p-4">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">{editing ? "Edit alert" : "Add alert"}</h3>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">From</label>
                  <select value={form.from_currency} onChange={(e) => setForm({ ...form, from_currency: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                    {CURRENCIES.map((currency) => (
                      <option key={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">To</label>
                  <select value={form.to_currency} onChange={(e) => setForm({ ...form, to_currency: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                    {CURRENCIES.map((currency) => (
                      <option key={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[9px] text-slate-400">Target rate</label>
                <input type="number" step="0.01" value={form.target_rate} onChange={(e) => setForm({ ...form, target_rate: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[9px] text-slate-600">
                <p className="font-semibold text-slate-800">Alert preview</p>
                <p className="mt-1">Tell me when {form.from_currency} reaches {form.to_currency} {formatNumber(form.target_rate, 2)}.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#55c94b] px-3 py-2 text-[10px] font-bold text-white">Save alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
