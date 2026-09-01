import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, Bell, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { getHistoricalRange } from "../api";
import { useRates } from "../hooks/useRates";
import { useSavedConversions } from "../hooks/useSavedConversions";
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

function formatSigned(value) {
  const num = Number(value || 0);
  return `${num >= 0 ? "+" : "-"}${formatNumber(Math.abs(num), 2)}`;
}

export default function Convert() {
  const [amount, setAmount] = useState(100000);
  const [from, setFrom] = useState("KES");
  const [to, setTo] = useState("USD");
  const [editing, setEditing] = useState(null);
  const [channel, setChannel] = useState("Remitly");
  const [history, setHistory] = useState(null);

  const { rates } = useRates(from);
  const { items = [], add, update } = useSavedConversions();

  useEffect(() => {
    if (from === to) {
      return;
    }

    let active = true;
    getHistoricalRange(from, to, "1W")
      .then((d) => {
        if (active) setHistory(d);
      })
      .catch(() => {
        if (active) setHistory(null);
      });

    return () => {
      active = false;
    };
  }, [from, to]);

  const rate = from === to ? 1 : rates?.[to];
  const result = rate ? amount * rate : 0;
  const compareValue = history?.first ? amount * history.first : amount * (rate || 0);
  const changeValue = result - compareValue;

  const summary = useMemo(() => {
    if (!rate || !Number.isFinite(Number(rate))) return "We need a current rate to compare this value.";
    if (Math.abs(changeValue) < 0.01) {
      return `Your ${formatNumber(amount, 0)} ${from} is worth about ${to} ${formatNumber(result, 2)} today. There is no major change from last week.`;
    }

    return `Your ${formatNumber(amount, 0)} ${from} is worth about ${to} ${formatNumber(result, 2)} today. That is ${formatNumber(Math.abs(changeValue), 2)} ${changeValue >= 0 ? "more" : "less"} than last week.`;
  }, [amount, changeValue, from, rate, result, to]);

  const save = async () => {
    if (!rate) return;
    const payload = { from, to, amount, rate, value: result, channel };
    if (editing) {
      await update(editing, payload);
      setEditing(null);
    } else {
      await add(payload);
    }
  };

  const edit = (c) => {
    setEditing(c.id);
    setAmount(c.amount);
    setFrom(c.from_currency);
    setTo(c.to_currency);
    setChannel(c.channel || "Remitly");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Convert"
        title="Convert your money"
        description="See what you have now, what it is worth, and what changed from last week."
      />

      <div className="grid gap-3 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="p-5 sm:p-6">
          <div className="grid items-center gap-2 md:grid-cols-[1fr_40px_1fr]">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-[9px] text-slate-400">You have</p>
              <div className="mt-2 flex items-center gap-2">
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md bg-slate-100 px-2 py-2 text-xs font-bold text-slate-700">
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  type="number"
                  className="w-full text-right text-2xl font-bold outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#55c94b] text-white"
            >
              <ArrowLeftRight size={15} />
            </button>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-[9px] text-slate-400">It is worth</p>
              <div className="mt-2 flex items-center gap-2">
                <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md bg-slate-100 px-2 py-2 text-xs font-bold text-slate-700">
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="w-full text-right text-2xl font-bold text-slate-900">{rate ? formatNumber(result, 2) : "—"}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] text-slate-400">Current rate</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  1 {from} = {rate ? formatNumber(rate, 4) : "—"} {to}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400">What changed</p>
                <p className={`mt-1 text-sm font-bold ${changeValue >= 0 ? "text-[#43b34d]" : "text-red-500"}`}>
                  {formatSigned(changeValue)} {to}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-white p-3">
              <p className="text-[9px] text-slate-400">What this means</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-600">{summary}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white"
            >
              <Save size={14} /> Save conversion
            </button>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-700">
              <option>Remitly</option>
              <option>Wise</option>
              <option>Bank</option>
              <option>Cash pickup</option>
            </select>
            <Link to="/alerts" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700">
              <Bell size={12} /> Set an alert
            </Link>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[10px] font-bold">Saved conversions</p>
            <p className="mt-1 text-[9px] text-slate-400">Recent values you can review or edit.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {items.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-800">
                    {item.from_currency} {formatNumber(item.amount, 0)} → {item.to_currency} {formatNumber(item.converted_value, 2)}
                  </p>
                  <p className="mt-1 text-[8px] text-slate-400">{item.channel || "Remitly"}</p>
                </div>
                <button onClick={() => edit(item)} className="rounded-lg border border-slate-200 px-2 py-1 text-[8px] font-semibold text-slate-700">
                  Edit
                </button>
              </div>
            ))}

            {!items.length && <p className="p-6 text-center text-[9px] text-slate-400">No saved conversions yet.</p>}
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold">Quick check</p>
                <p className="text-[9px] text-slate-400">Know the rate before you move money.</p>
              </div>
              <ArrowRight size={14} className="text-[#43b34d]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
