import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRates } from "../api";

const CURRENCIES = ["USD", "GBP", "EUR"];

const PROVIDERS = [
  {
    name: "Wise",
    fee: "0.45%",
    type: "Low-cost transfer",
  },
  {
    name: "Western Union",
    fee: "1.20%",
    type: "Global transfer",
  },
  {
    name: "WorldRemit",
    fee: "0.90%",
    type: "International transfer",
  },
  {
    name: "Bank transfer",
    fee: "1.50%",
    type: "Traditional banking",
  },
];

const QUICK_CONTEXT = [
  {
    title: "Kenya",
    description: "KES market overview",
    icon: "ti-map-pin",
    to: "/explore",
  },
  {
    title: "Travel",
    description: "Plan your travel money",
    icon: "ti-plane",
    to: "/travel",
  },
  {
    title: "Rate alerts",
    description: "Monitor important rates",
    icon: "ti-bell",
    to: "/monitor",
  },
];

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>

        <h2 className="text-lg font-semibold tracking-tight text-[#17201B]">
          {title}
        </h2>
      </div>

      {action}
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-black/6 bg-white/80",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [amount, setAmount] = useState(250000);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState("Wise");

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await getRates("KES");

        setRates(data.rates || {});
      } catch (error) {
        console.error("Unable to load exchange rates:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRates();
  }, []);

  const selectedRate = rates[currency];

  const convertedAmount = selectedRate
    ? amount * selectedRate
    : null;

  return (
    <div className="relative min-h-screen max-w-6xl font-display text-[#17201B]">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute -right-40 -top-32 h-96 w-96 rounded-full bg-hero-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 top-[45%] h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[35%] top-[65%] h-56 w-56 rounded-full bg-hero-accent/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative mb-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Financial workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#17201B] sm:text-4xl">
              Your money, understood.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#69756D]">
              Convert currencies, understand exchange rates, compare
              providers, and stay informed about the markets from one
              workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/6 bg-white/70 px-3 py-2 text-xs text-[#69756D] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(45,217,168,0.45)]" />
            Markets live
          </div>
        </div>
      </header>

      {/* Main money workspace */}
      <section className="relative mb-10">
        <SectionTitle
          eyebrow="Money"
          title="What is my money worth?"
          action={
            <Link
              to="/money"
              className="hidden text-xs font-medium text-accent transition hover:text-[#0D9F7D] sm:block"
            >
              Open converter →
            </Link>
          }
        />

        <GlassCard className="relative overflow-hidden p-6 sm:p-8">
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-hero-accent/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            {/* Currency controls */}
            <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              {/* KES */}
              <div className="rounded-2xl border border-black/6 bg-[#F7F8F5] p-4">
                <p className="mb-2 text-xs text-[#7B867F]">
                  You have
                </p>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-hero-accent/15 text-sm font-bold text-[#17201B]">
                    KES
                  </span>

                  <input
                    type="number"
                    value={amount}
                    onChange={(event) =>
                      setAmount(Number(event.target.value))
                    }
                    className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tabular-nums text-[#17201B] outline-none placeholder:text-[#A0AAA3]"
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-black/6 bg-white text-accent shadow-sm">
                <i className="ti ti-arrow-right text-lg" />
              </div>

              {/* Target currency */}
              <div className="rounded-2xl border border-black/6 bg-[#F7F8F5] p-4">
                <p className="mb-2 text-xs text-[#7B867F]">
                  You receive
                </p>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                    {currency}
                  </span>

                  <select
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value)
                    }
                    className="w-full cursor-pointer appearance-none bg-transparent text-2xl font-semibold text-[#17201B] outline-none"
                  >
                    {CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl bg-[#17201B] p-6 text-white shadow-xl sm:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-white/45">
                    Estimated value
                  </p>

                  <p className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                    {loading
                      ? "Loading..."
                      : convertedAmount
                        ? convertedAmount.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : "—"}
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    {currency} equivalent
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 px-4 py-3">
                  <p className="text-xs text-white/40">
                    Live mid-market rate
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    1 KES ={" "}
                    {selectedRate
                      ? selectedRate.toFixed(5)
                      : "—"}{" "}
                    {currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Provider comparison */}
      <section className="relative mb-10">
        <SectionTitle
          eyebrow="Compare"
          title="What your provider offers"
          action={
            <Link
              to="/money"
              className="hidden text-xs font-medium text-accent transition hover:text-[#0D9F7D] sm:block"
            >
              Compare all →
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDERS.map((provider) => {
            const isSelected =
              selectedProvider === provider.name;

            return (
              <button
                key={provider.name}
                type="button"
                onClick={() =>
                  setSelectedProvider(provider.name)
                }
                className={[
                  "group rounded-2xl border p-4 text-left",
                  "transition-all duration-300",
                  isSelected
                    ? "border-accent/30 bg-accent/5 shadow-md"
                    : "border-black/6 bg-white/80 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md",
                ].join(" ")}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F4EE] text-[#69756D] transition group-hover:bg-accent/10 group-hover:text-accent">
                    <i className="ti ti-building-bank" />
                  </div>

                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                      <i className="ti ti-check text-xs" />
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-[#17201B]">
                  {provider.name}
                </p>

                <p className="mt-1 text-xs text-[#89938C]">
                  {provider.type}
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#89938C]">
                      Fee
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#17201B]">
                      {provider.fee}
                    </p>
                  </div>

                  <i className="ti ti-arrow-up-right text-[#A3AAA5] transition group-hover:text-accent" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Information */}
      <section className="relative mb-10">
        <SectionTitle
          eyebrow="Information"
          title="Stay ahead of the market"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Historical rates */}
          <Link to="/rates">
            <GlassCard className="group h-full p-5 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-accent/10 text-hero-accent">
                  <i className="ti ti-chart-line" />
                </div>

                <i className="ti ti-arrow-up-right text-[#A0AAA3] transition group-hover:text-accent" />
              </div>

              <p className="text-sm font-semibold">
                Historical rates
              </p>

              <p className="mt-2 text-xs leading-relaxed text-[#7B867F]">
                See how currencies have moved over time and
                identify important market trends.
              </p>

              <div className="mt-6 flex h-16 items-end gap-1">
                {[30, 45, 35, 55, 42, 64, 52, 72, 65].map(
                  (height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-sm bg-accent/15 transition-all duration-300 group-hover:bg-accent/30"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </GlassCard>
          </Link>

          {/* Rate snapshot */}
          <Link to="/rates">
            <GlassCard className="group h-full p-5 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <i className="ti ti-world" />
                </div>

                <i className="ti ti-arrow-up-right text-[#A0AAA3] transition group-hover:text-accent" />
              </div>

              <p className="text-sm font-semibold">
                Exchange-rate snapshot
              </p>

              <div className="mt-5 space-y-3">
                {CURRENCIES.map((code) => (
                  <div
                    key={code}
                    className="flex items-center justify-between rounded-xl bg-[#F7F8F5] px-3 py-2.5"
                  >
                    <span className="text-xs font-medium">
                      KES / {code}
                    </span>

                    <span className="text-xs font-semibold tabular-nums">
                      {rates[code]
                        ? rates[code].toFixed(4)
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Link>

          {/* Financial news */}
          <Link to="/news">
            <GlassCard className="group h-full p-5 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-accent/10 text-hero-accent">
                  <i className="ti ti-news" />
                </div>

                <i className="ti ti-arrow-up-right text-[#A0AAA3] transition group-hover:text-accent" />
              </div>

              <p className="text-sm font-semibold">
                Financial news
              </p>

              <p className="mt-2 text-xs leading-relaxed text-[#7B867F]">
                Keep up with financial markets, currencies,
                economies, and events that may affect your money.
              </p>

              <div className="mt-5 rounded-xl bg-[#F7F8F5] p-3">
                <p className="text-xs font-medium leading-relaxed">
                  Latest market information
                </p>

                <p className="mt-1 text-[11px] text-[#89938C]">
                  Open financial news →
                </p>
              </div>
            </GlassCard>
          </Link>
        </div>
      </section>

      {/* Context */}
      <section className="relative pb-8">
        <SectionTitle
          eyebrow="Context"
          title="Money in the real world"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {QUICK_CONTEXT.map((item) => (
            <Link key={item.title} to={item.to}>
              <GlassCard className="group flex items-center gap-4 p-4 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F4EE] text-[#69756D] transition group-hover:bg-accent group-hover:text-white">
                  <i className={`ti ${item.icon}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-[#89938C]">
                    {item.description}
                  </p>
                </div>

                <i className="ti ti-chevron-right text-[#A0AAA3] transition group-hover:translate-x-1 group-hover:text-accent" />
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}