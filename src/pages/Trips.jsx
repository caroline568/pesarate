import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Globe2, Plane, Plus, Trash2, X } from "lucide-react";
import { tripsApi } from "../api-client";
import { useRates } from "../hooks/useRates";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR"];
const COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flags";

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

function getCountryName(country) {
  return country?.name?.common || country?.name?.official || "";
}

function findCountry(countries, name) {
  const target = String(name || "").trim().toLowerCase();
  return countries.find((country) => {
    const common = getCountryName(country).toLowerCase();
    const official = String(country?.name?.official || "").toLowerCase();
    return common === target || official === target;
  });
}

function CountryFlag({ country, size = "md" }) {
  if (!country?.flags?.svg && !country?.flags?.png) {
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">
        <Globe2 size={18} />
      </span>
    );
  }

  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ${size === "sm" ? "h-8 w-8" : "h-11 w-11"}`}>
      <img
        src={country.flags.svg || country.flags.png}
        alt={`${getCountryName(country)} flag`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { rates } = useRates("KES");

  const load = () => tripsApi.list().then((d) => setTrips(d.trips || [])).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let active = true;
    fetch(COUNTRIES_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load country information");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        const sorted = (Array.isArray(data) ? data : [])
          .filter((country) => country?.name?.common && country?.cca2)
          .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)));
        setCountries(sorted);
      })
      .catch(() => {
        if (active) setCountries([]);
      })
      .finally(() => {
        if (active) setCountriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const rate = rates?.[form.target_currency] ?? 0;
  const converted = rate ? Number(form.budget_kes) * rate : 0;
  const upcoming = useMemo(() => [...trips].sort((a, b) => a.travel_date.localeCompare(b.travel_date)), [trips]);
  const featuredTrip = upcoming[0];
  const featuredCountry = featuredTrip ? findCountry(countries, featuredTrip.destination) : findCountry(countries, form.destination);
  const selectedCountry = findCountry(countries, form.destination);
  const countryCurrency = Object.keys(selectedCountry?.currencies || {})[0];
  const availableCurrencies = Array.from(new Set([...(countryCurrency ? [countryCurrency] : []), ...CURRENCIES]));
  const featuredValue = featuredTrip ? (rates?.[featuredTrip.target_currency] ?? 0) * Number(featuredTrip.budget_kes || 0) : converted;

  const openCreate = () => {
    setError("");
    setEditing(null);
    setForm(blank);
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.destination || !form.travel_date || Number(form.days) < 1 || Number(form.budget_kes) <= 0) {
      setError("Please complete the destination, travel date, duration, and budget.");
      return;
    }

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
    setError("");
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
    try {
      await tripsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Trips"
        title="Your trips, planned smarter."
        description="Keep your travel plans and currency needs in one place."
        action={
          <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#43b34d]">
            <Plus size={14} /> Create trip
          </button>
        }
      />

      {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">{error}</p>}

      <Card className="relative mb-3 overflow-hidden p-5">
        <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#e9f8e9] opacity-70" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <CountryFlag country={featuredCountry} />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#43b34d]">Next adventure</p>
              <p className="mt-1 text-lg font-black tracking-tight text-slate-900">{featuredTrip?.destination || "Plan your next trip"}</p>
              <p className="mt-1 text-[9px] text-slate-400">
                {featuredTrip ? `${featuredTrip.travel_date} · ${featuredTrip.days} days` : "Set a destination, dates and budget to get started."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 md:min-w-[230px]">
            <p className="text-[8px] font-semibold uppercase tracking-[.1em] text-slate-400">Travel budget today</p>
            <p className="mt-1 text-xl font-black tracking-tight text-slate-900">KES {formatNumber(featuredTrip ? featuredTrip.budget_kes : form.budget_kes, 0)}</p>
            <p className="mt-1 text-[11px] font-bold text-[#43b34d]">≈ {featuredTrip ? featuredTrip.target_currency : form.target_currency} {formatNumber(featuredValue, 2)}</p>
          </div>
        </div>
      </Card>

      <Card className="mb-3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold">Your saved trips</p>
            <p className="mt-1 text-[9px] text-slate-400">Plan, convert, and monitor your travel budget.</p>
          </div>
          {upcoming.length > 0 && <span className="rounded-full bg-[#e9f8e9] px-2 py-1 text-[8px] font-bold text-[#43b34d]">{upcoming.length} {upcoming.length === 1 ? "trip" : "trips"}</span>}
        </div>

        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {upcoming.map((trip) => {
            const country = findCountry(countries, trip.destination);
            const tripValue = (rates?.[trip.target_currency] ?? 0) * Number(trip.budget_kes || 0);
            return (
              <div key={trip.id} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <CountryFlag country={country} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">{trip.destination}</p>
                      <p className="mt-0.5 text-[8px] text-slate-400">{country ? getCountryName(country) : "Destination country"}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500"><Countdown date={trip.travel_date} /></span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[8px] text-slate-400">Travel dates</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{trip.travel_date}</p>
                    <p className="mt-0.5 text-[8px] text-slate-400">{trip.days} days</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-right">
                    <p className="text-[8px] text-slate-400">Destination currency</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{trip.target_currency}</p>
                    <p className="mt-0.5 text-[8px] text-slate-400">Current rate context</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-[8px] text-slate-400">Budget</p>
                    <p className="mt-1 text-xs font-black text-slate-900">KES {formatNumber(trip.budget_kes, 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-400">Worth now</p>
                    <p className="mt-1 text-xs font-black text-[#43b34d]">{trip.target_currency} {formatNumber(tripValue, 2)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-slate-400"><CalendarDays size={10} /> {trip.channel || "Travel budget"}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => edit(trip)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-slate-700 transition hover:bg-slate-50">
                      <Edit3 size={11} /> Edit
                    </button>
                    <button onClick={() => remove(trip.id)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!upcoming.length && (
            <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e9f8e9] text-[#43b34d]"><Plane size={21} /></div>
              <p className="mt-4 text-sm font-black text-slate-900">Your next adventure starts here.</p>
              <p className="mx-auto mt-1 max-w-sm text-[9px] leading-5 text-slate-400">Create a trip to organize your destination, dates and travel budget in one place.</p>
              <button onClick={openCreate} className="mt-4 rounded-lg bg-[#55c94b] px-4 py-2.5 text-[9px] font-bold text-white">Create your first trip</button>
            </div>
          )}
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-slate-900/25 p-4 backdrop-blur-[2px]">
          <div className="mx-auto my-6 max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#43b34d]">Travel plan</p>
                <h3 className="mt-1 text-base font-black text-slate-900">{editing ? "Edit trip" : "Create a trip"}</h3>
                <p className="mt-1 text-[9px] text-slate-400">Plan the money side of your next adventure.</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"><X size={14} /></button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="mb-1 block text-[9px] font-semibold text-slate-600">Destination country</label>
                <div className="relative">
                  <select
                    value={form.destination}
                    onChange={(e) => {
                      const country = findCountry(countries, e.target.value);
                      setForm({ ...form, destination: e.target.value, target_currency: Object.keys(country?.currencies || {})[0] || form.target_currency });
                    }}
                    disabled={countriesLoading}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#55c94b] disabled:bg-slate-50"
                  >
                    {countriesLoading && <option>Loading countries…</option>}
                    {!countriesLoading && countries.map((country) => <option key={country.cca2} value={getCountryName(country)}>{getCountryName(country)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">Travel date</label>
                  <input type="date" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]" />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">Duration</label>
                  <input type="number" min="1" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">Budget (KES)</label>
                  <input type="number" min="1" value={form.budget_kes} onChange={(e) => setForm({ ...form, budget_kes: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]" />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">Destination currency</label>
                  <select value={form.target_currency} onChange={(e) => setForm({ ...form, target_currency: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]">
                    {availableCurrencies.map((currency) => <option key={currency}>{currency}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <CountryFlag country={findCountry(countries, form.destination)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-semibold uppercase tracking-[.1em] text-slate-400">Budget preview</p>
                  <p className="mt-1 text-[10px] font-bold text-slate-800">KES {formatNumber(form.budget_kes, 0)} ≈ {form.target_currency} {formatNumber(converted, 2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#55c94b] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#43b34d]">{editing ? "Update trip" : "Save trip"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
