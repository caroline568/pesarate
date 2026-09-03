import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Globe2,
  Plane,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { tripsApi, conversionsApi } from "../api-client";
import { useRates } from "../hooks/useRates";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";
import COUNTRIES from "../data/countries";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR"];

const CHANNELS = [
  "Wise",
  "Remitly",
  "Bank",
  "M-Pesa",
  "Cash pickup",
];



const DEFAULT_BREAKDOWN = {
  Accommodation: 30,
  Food: 25,
  Transport: 15,
  Activities: 15,
  Shopping: 5,
  Emergency: 10,
};

const blank = {
  destination: "United Kingdom",
  country_code: "GB",
  travel_date: "",
  days: 7,
  budget_kes: 150000,
  target_currency: "GBP",
  channel: "Wise",
  budget_breakdown: DEFAULT_BREAKDOWN,
  currency_recommendation: "GBP",
  channel_recommendation: "Wise",
};

function Countdown({ date }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const run = () => {
      const ms = new Date(`${date}T00:00:00`) - new Date();
      const d = Math.ceil(ms / 86400000);

      setText(
        d < 0 ? "Past" : d === 0 ? "Today" : `${d} days`
      );
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
  return country?.name || "";
}

function findCountry(countries, value) {
  const target = String(value || "").trim().toLowerCase();

  return countries.find((country) => {
    return (
      country?.code?.toLowerCase() === target ||
      country?.name?.toLowerCase() === target
    );
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
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ${
        size === "sm" ? "h-8 w-8" : "h-11 w-11"
      }`}
    >
      <img
        src={country.flags.svg || country.flags.png}
        alt={`${getCountryName(country)} flag`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

function normaliseBreakdown(value) {
  const source =
    value && typeof value === "object" ? value : {};

  return Object.fromEntries(
    Object.keys(DEFAULT_BREAKDOWN).map((key) => [
      key,
      Number.isFinite(Number(source[key]))
        ? Number(source[key])
        : DEFAULT_BREAKDOWN[key],
    ])
  );
}

function rebalanceBreakdown(breakdown, changedKey) {
  const next = { ...breakdown };

  const others = Object.keys(next).filter(
    (key) => key !== changedKey
  );

  const remaining = Math.max(
    0,
    100 - Number(next[changedKey] || 0)
  );

  const currentOthers = others.reduce(
    (sum, key) =>
      sum + Math.max(0, Number(next[key]) || 0),
    0
  );

  if (!others.length) return next;

  if (currentOthers === 0) {
    others.forEach((key) => {
      next[key] = remaining / others.length;
    });
  } else {
    others.forEach((key) => {
      next[key] =
        (Math.max(0, Number(next[key]) || 0) /
          currentOthers) *
        remaining;
    });
  }

  return next;
}

function channelCost(amount, channel) {
  const pricing = {
    Wise: [0.008, 100],
    Remitly: [0.012, 150],
    Bank: [0.015, 250],
    "M-Pesa": [0.01, 100],
    "Cash pickup": [0.02, 300],
  };

  const [percent, fixed] =
    pricing[channel] || pricing.Wise;

  const value = Number(amount) || 0;

  return Math.min(
    value,
    value * percent + fixed
  );
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const countries = COUNTRIES;
  const countriesLoading = false;

  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [recommendationsLoading, setRecommendationsLoading] =
    useState(false);

  const { rates } = useRates("KES");

  const load = () =>
    tripsApi
      .list()
      .then((data) => setTrips(data.trips || []))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);


  const selectedCountry = findCountry(
    countries,
    form.country_code || form.destination
  );

  const countryCurrency =
    selectedCountry?.currency;

  const availableCurrencies = Array.from(
    new Set([
      ...(countryCurrency ? [countryCurrency] : []),
      ...CURRENCIES,
    ])
  );

  const rate =
    rates?.[form.target_currency] ?? 0;

  const converted = rate
    ? Number(form.budget_kes) * rate
    : 0;

  const breakdown = normaliseBreakdown(
    form.budget_breakdown
  );

  const breakdownTotal = Object.values(
    breakdown
  ).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );

  const dailyBudget =
    Number(form.days) > 0
      ? Number(form.budget_kes) /
        Number(form.days)
      : 0;

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...trips]
      .filter((trip) => {
        if (!trip.travel_date) return false;

        const date = new Date(
          `${trip.travel_date}T00:00:00`
        );

        return date >= today;
      })
      .sort((a, b) =>
        String(a.travel_date || "").localeCompare(
          String(b.travel_date || "")
        )
      );
  }, [trips]);

  const featuredTrip = upcoming[0];

  const featuredCountry = featuredTrip
    ? findCountry(
        countries,
        featuredTrip.country_code ||
          featuredTrip.destination
      )
    : selectedCountry;

  const featuredValue = featuredTrip
    ? (rates?.[featuredTrip.target_currency] ?? 0) *
      Number(featuredTrip.budget_kes || 0)
    : converted;

  const getRecommendations = async (nextForm) => {
    setRecommendationsLoading(true);

    try {
      const destinationCountry = findCountry(
        countries,
        nextForm.country_code ||
          nextForm.destination
      );

      const localCurrency =
        destinationCountry?.currency;

      const currency =
        localCurrency ||
        nextForm.target_currency;

      const results = await Promise.all(
        CHANNELS.map(async (channel) => {
          try {
            const response =
              await conversionsApi.compare({
                from: "KES",
                to: currency,
                amount:
                  Number(nextForm.budget_kes) || 0,
                channel,
              });

            return (
              response?.comparison || {
                channel,
                fee: channelCost(
                  nextForm.budget_kes,
                  channel
                ),
              }
            );
          } catch {
            return {
              channel,
              fee: channelCost(
                nextForm.budget_kes,
                channel
              ),
            };
          }
        })
      );

      const best = [...results].sort(
        (a, b) =>
          Number(a.fee || 0) -
          Number(b.fee || 0)
      )[0];

      setForm((current) => ({
        ...current,
        ...nextForm,
        target_currency: currency,
        currency_recommendation: currency,
        channel_recommendation:
          best?.channel || "Wise",
      }));
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const openCreate = () => {
    setError("");
    setEditing(null);

    setForm({
      ...blank,
      budget_breakdown: {
        ...DEFAULT_BREAKDOWN,
      },
    });

    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.destination ||
      !form.country_code ||
      !form.travel_date ||
      Number(form.days) < 1 ||
      Number(form.budget_kes) <= 0
    ) {
      setError(
        "Please complete the destination, travel date, duration, and budget."
      );
      return;
    }

    if (
      Math.abs(breakdownTotal - 100) >
      0.01
    ) {
      setError(
        "Your budget categories must add up to 100%."
      );
      return;
    }

    const payload = {
      ...form,
      days: Number(form.days),
      budget_kes: Number(form.budget_kes),
      budget_breakdown: breakdown,
      rate: Number(rate || 0),
      converted_amount: Number(
        converted || 0
      ),
    };

    try {
      if (editing) {
        await tripsApi.update(
          editing,
          payload
        );
      } else {
        await tripsApi.create(payload);
      }

      setForm({
        ...blank,
        budget_breakdown: {
          ...DEFAULT_BREAKDOWN,
        },
      });

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
      ...blank,
      destination: trip.destination,
      country_code:
        trip.country_code ||
        findCountry(
          countries,
          trip.destination
        )?.code ||
        "",
      travel_date: trip.travel_date,
      days: trip.days,
      budget_kes: trip.budget_kes,
      target_currency:
        trip.target_currency,
      channel:
        trip.channel || "Wise",
      budget_breakdown:
        normaliseBreakdown(
          trip.budget_breakdown
        ),
      currency_recommendation:
        trip.currency_recommendation ||
        trip.target_currency,
      channel_recommendation:
        trip.channel_recommendation ||
        trip.channel ||
        "Wise",
    });

    setOpen(true);
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this trip?"
      )
    ) {
      return;
    }

    try {
      await tripsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCountry = async (value) => {
    const country = findCountry(
      countries,
      value
    );

    const next = {
      ...form,
      destination:
        getCountryName(country) || value,
      country_code:
        country?.code || "",
      target_currency:
        country?.currency ||
        form.target_currency,
    };

    setForm(next);

    await getRecommendations(next);
  };

  const updateBudget = async (value) => {
    const next = {
      ...form,
      budget_kes:
        Number(value) || 0,
    };

    setForm(next);

    if (
      Number(value) > 0 &&
      form.country_code
    ) {
      await getRecommendations(next);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Trips"
        title="Your trips, planned smarter."
        description="Keep your travel plans, budget and currency decisions in one place."
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#43b34d]"
          >
            <Plus size={14} />
            Create trip
          </button>
        }
      />

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {error}
        </p>
      )}

      <Card className="relative mb-3 overflow-hidden p-5">
        <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#e9f8e9] opacity-70" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <CountryFlag country={featuredCountry} />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#43b34d]">
                Next adventure
              </p>

              <p className="mt-1 text-lg font-black tracking-tight text-slate-900">
                {featuredTrip?.destination ||
                  "Plan your next trip"}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                {featuredTrip
                  ? `${featuredTrip.travel_date} · ${featuredTrip.days} days`
                  : "Set a destination, dates and budget to get started."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 md:min-w-57.5">
            <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
              Travel budget
            </p>

            <p className="mt-1 text-xl font-black tracking-tight text-slate-900">
              KES{" "}
              {formatNumber(
                featuredTrip
                  ? featuredTrip.budget_kes
                  : form.budget_kes,
                0
              )}
            </p>

            <p className="mt-1 text-[11px] font-bold text-[#43b34d]">
              ≈{" "}
              {featuredTrip
                ? featuredTrip.target_currency
                : form.target_currency}{" "}
              {formatNumber(
                featuredValue,
                2
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold">
              Your saved trips
            </p>

            <p className="mt-1 text-[9px] text-slate-400">
              Plan, convert, allocate, and compare your travel money.
            </p>
          </div>

          {upcoming.length > 0 && (
            <span className="rounded-full bg-[#e9f8e9] px-2 py-1 text-[8px] font-bold text-[#43b34d]">
              {upcoming.length}{" "}
              {upcoming.length === 1
                ? "trip"
                : "trips"}
            </span>
          )}
        </div>

        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {upcoming.map((trip) => {
            const country = findCountry(
              countries,
              trip.country_code ||
                trip.destination
            );

            const tripValue =
              (rates?.[
                trip.target_currency
              ] ?? 0) *
              Number(
                trip.budget_kes || 0
              );

            const tripBreakdown =
              normaliseBreakdown(
                trip.budget_breakdown
              );

            return (
              <div
                key={trip.id}
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <CountryFlag
                      country={country}
                      size="sm"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">
                        {trip.destination}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {country
                          ? getCountryName(
                              country
                            )
                          : "Destination country"}{" "}
                        · {trip.target_currency}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500">
                    <Countdown
                      date={
                        trip.travel_date
                      }
                    />
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[8px] text-slate-400">
                      Travel dates
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-slate-800">
                      {trip.travel_date}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      {trip.days} days
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-right">
                    <p className="text-[8px] text-slate-400">
                      Exchange channel
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-slate-800">
                      {trip.channel ||
                        "Wise"}
                    </p>

                    {trip.channel_recommendation && (
                      <p className="mt-0.5 text-[8px] font-bold text-[#43b34d]">
                        Recommended:{" "}
                        {
                          trip.channel_recommendation
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-400">
                        Total budget
                      </p>

                      <p className="mt-1 text-xs font-black text-slate-900">
                        KES{" "}
                        {formatNumber(
                          trip.budget_kes,
                          0
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] text-slate-400">
                        Worth now
                      </p>

                      <p className="mt-1 text-xs font-black text-[#43b34d]">
                        {
                          trip.target_currency
                        }{" "}
                        {formatNumber(
                          tripValue,
                          2
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {Object.entries(
                      tripBreakdown
                    ).map(
                      ([
                        category,
                        percent,
                      ]) => (
                        <div
                          key={category}
                          className="rounded-lg bg-slate-50 px-2 py-2"
                        >
                          <p className="truncate text-[7px] text-slate-400">
                            {category}
                          </p>

                          <p className="mt-0.5 text-[9px] font-black text-slate-800">
                            {formatNumber(
                              (Number(
                                trip.budget_kes ||
                                  0
                              ) *
                                Number(
                                  percent || 0
                                )) /
                                100,
                              0
                            )}
                          </p>

                          <p className="text-[7px] font-semibold text-[#43b34d]">
                            {formatNumber(
                              percent,
                              0
                            )}
                            %
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-slate-400">
                    <CalendarDays size={10} />
                    {trip.currency_recommendation
                      ? `Currency: ${trip.currency_recommendation}`
                      : "Travel plan"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        edit(trip)
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit3 size={11} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        remove(trip.id)
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!upcoming.length && (
            <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e9f8e9] text-[#43b34d]">
                <Plane size={21} />
              </div>

              <p className="mt-4 text-sm font-black text-slate-900">
                Your next adventure starts here.
              </p>

              <p className="mx-auto mt-1 max-w-sm text-[9px] leading-5 text-slate-400">
                Create a trip to organize your destination, dates, budget, currency and exchange channel.
              </p>

              <button
                onClick={openCreate}
                className="mt-4 rounded-lg bg-[#55c94b] px-4 py-2.5 text-[9px] font-bold text-white"
              >
                Create your first trip
              </button>
            </div>
          )}
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-slate-900/25 p-4 backdrop-blur-[2px]">
          <div className="mx-auto my-6 max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#43b34d]">
                  Travel plan
                </p>

                <h3 className="mt-1 text-base font-black text-slate-900">
                  {editing
                    ? "Edit trip"
                    : "Create a trip"}
                </h3>

                <p className="mt-1 text-[9px] text-slate-400">
                  Choose the country, currency, channel and exactly how your budget should be used.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={submit}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-[9px] font-semibold text-slate-600">
                  Destination country
                </label>

                <select
                  value={
                    form.country_code ||
                    form.destination
                  }
                  onChange={(event) =>
                    updateCountry(
                      event.target.value
                    )
                  }
                  disabled={
                    countriesLoading ||
                    recommendationsLoading
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#55c94b] disabled:bg-slate-50"
                >
                  {countriesLoading && (
                    <option>
                      Loading countries…
                    </option>
                  )}

                  {!countriesLoading &&
                    countries.map(
                      (country) => (
                        <option
                          key={country.code}
                          value={country.code}
                        >
                          {getCountryName(
                            country
                          )}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">
                    Travel date
                  </label>

                  <input
                    type="date"
                    value={
                      form.travel_date
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        travel_date:
                          event.target
                            .value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">
                    Duration (days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.days}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        days:
                          Number(
                            event.target
                              .value
                          ) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">
                    Budget (KES)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.budget_kes
                    }
                    onChange={(event) =>
                      updateBudget(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-semibold text-slate-600">
                    Currency to use
                  </label>

                  <select
                    value={
                      form.target_currency
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        target_currency:
                          event.target
                            .value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#55c94b]"
                  >
                    {availableCurrencies.map(
                      (currency) => (
                        <option
                          key={currency}
                        >
                          {currency}
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-1 text-[8px] font-semibold text-[#43b34d]">
                    Recommended:{" "}
                    {form.currency_recommendation ||
                      countryCurrency ||
                      form.target_currency}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-600">
                      Exchange channel
                    </label>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      Choose the provider you want to use for this trip.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e9f8e9] px-2 py-1 text-[8px] font-bold text-[#43b34d]">
                    Recommended:{" "}
                    {form.channel_recommendation ||
                      "Wise"}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-5">
                  {CHANNELS.map(
                    (channel) => {
                      const selected =
                        form.channel ===
                        channel;

                      return (
                        <button
                          key={channel}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              channel,
                            })
                          }
                          className={`rounded-xl border p-3 text-left transition ${
                            selected
                              ? "border-[#55c94b] bg-[#f3fbf2] shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <p className="text-[9px] font-black text-slate-800">
                            {channel}
                          </p>

                          <p className="mt-1 text-[8px] text-slate-400">
                            Demo cost: KES{" "}
                            {formatNumber(
                              channelCost(
                                form.budget_kes,
                                channel
                              ),
                              0
                            )}
                          </p>

                          {form.channel_recommendation ===
                            channel && (
                            <p className="mt-1 text-[7px] font-black text-[#43b34d]">
                              Lowest cost
                            </p>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-slate-800">
                      Budget allocation
                    </p>

                    <p className="mt-1 text-[8px] text-slate-400">
                      Tell PesaRate where your travel money should go.
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-black ${
                      Math.abs(
                        breakdownTotal - 100
                      ) < 0.01
                        ? "text-[#43b34d]"
                        : "text-red-500"
                    }`}
                  >
                    {formatNumber(
                      breakdownTotal,
                      0
                    )}
                    % allocated
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(
                    breakdown
                  ).map(
                    ([category, percent]) => (
                      <div
                        key={category}
                        className="rounded-xl bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-[8px] font-semibold text-slate-600">
                            {category}
                          </label>

                          <span className="text-[8px] font-black text-slate-800">
                            {formatNumber(
                              (Number(
                                form.budget_kes ||
                                  0
                              ) *
                                Number(
                                  percent || 0
                                )) /
                                100,
                              0
                            )}{" "}
                            KES
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={percent}
                            onChange={(
                              event
                            ) => {
                              const value =
                                Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    Number(
                                      event
                                        .target
                                        .value
                                    ) || 0
                                  )
                                );

                              setForm({
                                ...form,
                                budget_breakdown:
                                  rebalanceBreakdown(
                                    {
                                      ...breakdown,
                                      [category]:
                                        value,
                                    },
                                    category
                                  ),
                              });
                            }}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-[9px] outline-none focus:border-[#55c94b]"
                          />

                          <span className="text-[8px] text-slate-400">
                            %
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      budget_breakdown: {
                        ...DEFAULT_BREAKDOWN,
                      },
                    })
                  }
                  className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw size={10} />
                  Reset allocation
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[8px] text-slate-400">
                    Daily budget
                  </p>

                  <p className="mt-1 text-xs font-black text-slate-900">
                    KES{" "}
                    {formatNumber(
                      dailyBudget,
                      0
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[8px] text-slate-400">
                    Currency recommendation
                  </p>

                  <p className="mt-1 text-xs font-black text-[#43b34d]">
                    {form.currency_recommendation ||
                      form.target_currency}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[8px] text-slate-400">
                    Channel recommendation
                  </p>

                  <p className="mt-1 text-xs font-black text-[#43b34d]">
                    {form.channel_recommendation ||
                      "Wise"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <CountryFlag
                  country={selectedCountry}
                  size="sm"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Live rate preview
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-slate-800">
                    KES{" "}
                    {formatNumber(
                      form.budget_kes,
                      0
                    )}{" "}
                    ≈{" "}
                    {
                      form.target_currency
                    }{" "}
                    {formatNumber(
                      converted,
                      2
                    )}
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    Country:{" "}
                    {getCountryName(
                      selectedCountry
                    ) ||
                      form.destination}
                  </p>
                </div>
              </div>

              {recommendationsLoading && (
                <div className="flex items-center gap-2 rounded-lg bg-[#f3fbf2] p-3 text-[9px] font-semibold text-[#43b34d]">
                  <Sparkles size={12} />
                  Updating currency and channel recommendations…
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    recommendationsLoading
                  }
                  className="rounded-lg bg-[#55c94b] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#43b34d] disabled:opacity-60"
                >
                  {editing
                    ? "Update trip"
                    : "Save trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
