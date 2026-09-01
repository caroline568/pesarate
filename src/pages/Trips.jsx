import { useEffect, useMemo, useState } from "react";
import { Edit3, Plane, Plus, Trash2, X } from "lucide-react";
import { tripsApi } from "../api-client";
import { useRates } from "../hooks/useRates";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR"];
const blank = {
  destination: "United Kingdom",
  travel_date: "",
  days: 7,
  budget_kes: 150000,
  target_currency: "GBP",
  channel: "Remitly",
};

function Countdown({ date }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const run = () => {
      const ms = new Date(`${date}T00:00:00`) - new Date();
      const d = Math.ceil(ms / 86400000);
      setText(d < 0 ? "Past" : d === 0 ? "Today" : `${d} days`);
    };
    run();
    const id = setInterval(run, 3600000);
    return () => clearInterval(id);
  }, [date]);

  return text;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(Number(value))) return "—";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { rates } = useRates("KES");

  const load = () => tripsApi.list().then((d) => setTrips(d.trips || [])).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const rate = rates?.[form.target_currency] ?? 0;
  const converted = rate ? Number(form.budget_kes) * rate : 0;
  const upcoming = useMemo(() => [...trips].sort((a, b) => a.travel_date.localeCompare(b.travel_date)), [trips]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      days: Number(form.days),
      budget_kes: Number(form.budget_kes),
      rate: Number(rate || 0),
      converted_amount: Number(converted || 0),
    };

    try {
      if (editing) {
        await tripsApi.update(editing, payload);
      } else {
        await tripsApi.create(payload);
      }
      setForm(blank);
      setEditing(null);
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (trip) => {
    setEditing(trip.id);
    setForm({
      destination: trip.destination,
      travel_date: trip.travel_date,
      days: trip.days,
      budget_kes: trip.budget_kes,
      target_currency: trip.target_currency,
      channel: trip.channel || "Remitly",
    });
    setOpen(true);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    await tripsApi.remove(id);
    load();
  };

  const featuredTrip = upcoming[0];
  const featuredValue = featuredTrip ? (rates?.[featuredTrip.target_currency] ?? 0) * Number(featuredTrip.budget_kes || 0) : converted;

  return (
    <div>
      <PageHeader
        eyebrow="Trips"
        title="Plan your trip"
        description="See your travel budget in the destination currency before you move your money."
        action={
          <button onClick={() => { setEditing(null); setForm(blank); setOpen(true); }} className="flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white">
            <Plus size={14} /> Add new trip
          </button>
        }
      />

      {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">{error}</p>}

      <Card className="mb-3 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e9f8e9] text-[#43b34d]">
            <Plane size={17} />
          </span>
          <div>
            <p className="text-[10px] font-bold">My travel budget</p>
            <p className="text-[9px] text-slate-400">Your money in the destination currency</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-[10px] text-slate-400">Budget today</p>
          <p className="mt-2 text-[28px] font-black tracking-tight text-slate-900">
            KES {formatNumber(featuredTrip ? featuredTrip.budget_kes : form.budget_kes, 0)}
          </p>
          <p className="mt-2 text-[16px] font-bold text-[#43b34d]">
            ≈ {featuredTrip ? featuredTrip.target_currency : form.target_currency} {formatNumber(featuredValue, 2)}
          </p>
          <p className="mt-2 text-[11px] leading-5 text-slate-600">
            Your travel budget is currently worth about {featuredTrip ? featuredTrip.target_currency : form.target_currency} {formatNumber(featuredValue, 2)}.
          </p>
        </div>
      </Card>

      <Card className="mb-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold">Your saved trips</p>
            <p className="text-[9px] text-slate-400">Plan, convert, and monitor your travel budget.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {upcoming.map((trip) => (
            <div key={trip.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-slate-800">{trip.destination}</p>
                  <p className="mt-1 text-[8px] text-slate-400">{trip.travel_date} · {trip.target_currency}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold text-[#43b34d]">{trip.days} days</p>
                  <p className="text-[8px] text-slate-400"><Countdown date={trip.travel_date} /></p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-2.5">
                <div>
                  <p className="text-[8px] text-slate-400">Budget</p>
                  <p className="text-[11px] font-bold text-slate-800">KES {formatNumber(trip.budget_kes, 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-400">Worth now</p>
                  <p className="text-[11px] font-bold text-slate-800">{trip.target_currency} {formatNumber((rates?.[trip.target_currency] ?? 0) * Number(trip.budget_kes || 0), 2)}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => edit(trip)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[8px] font-semibold text-slate-700">
                  <Edit3 size={11} /> Edit
                </button>
                <button onClick={() => remove(trip.id)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[8px] font-semibold text-slate-700">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}

          {!upcoming.length && <p className="py-8 text-center text-[9px] text-slate-400">No trips saved yet.</p>}
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/25 p-4">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">{editing ? "Edit trip" : "Add trip"}</h3>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="mb-1 block text-[9px] text-slate-400">Destination</label>
                <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">Travel date</label>
                  <input type="date" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">Days</label>
                  <input type="number" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">Budget (KES)</label>
                  <input type="number" value={form.budget_kes} onChange={(e) => setForm({ ...form, budget_kes: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] text-slate-400">Destination currency</label>
                  <select value={form.target_currency} onChange={(e) => setForm({ ...form, target_currency: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                    {CURRENCIES.map((currency) => (
                      <option key={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[9px] text-slate-600">
                <p className="font-semibold text-slate-800">Budget preview</p>
                <p className="mt-1">KES {formatNumber(form.budget_kes, 0)} ≈ {form.target_currency} {formatNumber((rates?.[form.target_currency] ?? 0) * Number(form.budget_kes || 0), 2)}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#55c94b] px-3 py-2 text-[10px] font-bold text-white">Save trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
