import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bell, ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { getHistoricalRange } from "../api";
import { useRates } from "../hooks/useRates";
import { useSavedConversions } from "../hooks/useSavedConversions";
import { useRateAlerts } from "../hooks/useRateAlerts";
import { tripsApi } from "../api-client";
import { Card } from "../components/Card";
import { ErrorState, LoadingGrid } from "../components/DataState";

const RATES = ["USD", "GBP", "EUR", "AED"];
const CURRENCY_LABELS = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  AED: "UAE Dirham",
  KES: "Kenyan Shilling",
  TZS: "Tanzanian Shilling",
  UGX: "Ugandan Shilling",
  ZAR: "South African Rand",
};

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(Number(value))) return "—";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatMoney(value, currency) {
  if (!Number.isFinite(Number(value))) return "—";
  const digits = ["JPY"].includes(currency) ? 0 : 2;
  return `${currency} ${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function describeRateChange(changePercent, changeValue, currency) {
  const isPositive = changeValue >= 0;
  const percent = Math.abs(changePercent || 0);

  if (Math.abs(changeValue) < 0.01) {
    return `Your money is about the same as last week.`;
  }

  return `${isPositive ? "Up" : "Down"} ${percent.toFixed(1)}% from last week. Your money is worth about ${formatMoney(Math.abs(changeValue), currency)} ${isPositive ? "more" : "less"} than it was last week.`;
}

function MiniLine({ positive = true }) {
  return (
    <svg viewBox="0 0 90 32" className="h-9 w-20" aria-hidden="true">
      <polyline
        fill="none"
        stroke={positive ? "#55c94b" : "#ed7180"}
        strokeWidth="1.7"
        points={
          positive
            ? "0,24 8,22 15,25 23,16 31,18 40,11 49,15 58,7 66,10 75,4 90,8"
            : "0,8 9,13 17,10 26,19 34,14 43,25 52,19 60,23 69,15 79,21 90,17"
        }
      />
    </svg>
  );
}

function Countdown({ date }) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const tick = () => {
      setDays(Math.max(0, Math.ceil((new Date(`${date}T00:00:00`) - new Date()) / 86400000)));
    };
    tick();
    const id = setInterval(tick, 3600000);
    return () => clearInterval(id);
  }, [date]);

  return <span>{days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`}</span>;
}

export default function Dashboard() {
  const { rates, status, reload } = useRates("KES");
  const { items: conversions, status: convStatus } = useSavedConversions();
  const { items: alerts } = useRateAlerts();
  const [trips, setTrips] = useState([]);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    tripsApi.list().then((d) => setTrips(d.trips || [])).catch(() => {});
  }, []);

  const latestConversion = useMemo(() => {
    if (conversions[0]) {
      return {
        from: conversions[0].from_currency,
        to: conversions[0].to_currency,
        amount: Number(conversions[0].amount || 0),
        value: Number(conversions[0].converted_value || 0),
        rate: Number(conversions[0].rate || 0),
      };
    }

    return {
      from: "USD",
      to: "KES",
      amount: 2000,
      value: Number((rates?.KES || 0) * 2000 || 0),
      rate: Number(rates?.KES || 0),
    };
  }, [conversions, rates]);

  useEffect(() => {
    const from = latestConversion.from;
    const to = latestConversion.to;
    if (!from || !to || from === to) {
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
  }, [latestConversion]);

  const fallbackRate = Number(latestConversion.rate) || 1;
  const previousValue = latestConversion.amount * (history?.first ?? fallbackRate);
  const changeValue = latestConversion.value - previousValue;
  const changePercent = history?.changePercent ?? ((latestConversion.value - previousValue) / Math.max(previousValue, 1)) * 100;
  const summaryLine = describeRateChange(changePercent, changeValue, latestConversion.to);
  const upcoming = useMemo(
    () =>
      trips
        .filter((t) => new Date(`${t.travel_date}T23:59:59`) > new Date())
        .sort((a, b) => a.travel_date.localeCompare(b.travel_date))
        .slice(0, 3),
    [trips]
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[16px] font-bold text-slate-900">What is my money worth?</h1>
        <p className="mt-0.5 text-[10px] text-slate-400">See the value today, compare it to last week, and decide what to do next.</p>
      </div>

      {status === "error" && <ErrorState message="Live rates could not be loaded." onRetry={reload} />}
      {status === "loading" && <LoadingGrid count={4} className="xl:grid-cols-4" />}

      {status === "ready" && (
        <>
          <Card className="mb-3 overflow-hidden p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Your money</p>
                <h2 className="mt-2 text-[28px] font-black tracking-tight text-slate-900">
                  {latestConversion.from} {formatNumber(latestConversion.amount, 0)} → {latestConversion.to} {formatNumber(latestConversion.value, 0)}
                </h2>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf9ed] text-[#43b34d]">
                <Wallet size={18} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-[10px]">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-slate-400">Current rate</p>
                <p className="mt-1 font-bold text-slate-900">1 {latestConversion.from} = {formatNumber(latestConversion.rate, 3)} {latestConversion.to}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-slate-400">Recent change</p>
                <p className={`mt-1 font-bold ${changeValue >= 0 ? "text-[#43b34d]" : "text-red-500"}`}>
                  {changeValue >= 0 ? "+" : "-"}
                  {formatNumber(Math.abs(changeValue), 0)} {latestConversion.to}
                  {" "}
                  ({Math.abs(changePercent).toFixed(1)}%)
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-slate-600">
              <span className="font-semibold text-slate-900">What this means:</span> {summaryLine}
            </p>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RATES.map((currency, index) => (
              <Card key={currency} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currency === "USD" ? "🇺🇸" : currency === "GBP" ? "🇬🇧" : currency === "EUR" ? "🇪🇺" : "🇦🇪"}</span>
                      <span className="text-xs font-bold text-slate-800">{currency}</span>
                    </div>
                    <p className="mt-0.5 text-[9px] text-slate-400">{CURRENCY_LABELS[currency]}</p>
                  </div>
                  <MiniLine positive={index % 2 === 0} />
                </div>
                <div className="mt-3 text-[24px] font-bold tracking-tight text-slate-900">{rates?.[currency]?.toFixed(2) || "—"}</div>
                <p className="mt-1 text-[9px] font-semibold text-[#55b965]">{rates?.[currency] ? "Live" : "—"}</p>
              </Card>
            ))}
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[.92fr_1.45fr_.85fr]">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold">Today’s snapshot</p>
                  <p className="mt-1 text-[9px] text-slate-400">How the Kenyan Shilling is moving.</p>
                </div>
                <TrendingUp className="text-[#55c94b]" size={18} />
              </div>
              <div className="mt-5 space-y-3">
                {RATES.map((currency, index) => (
                  <div key={currency} className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-700">{currency}</span>
                    <span className={index % 2 === 0 ? "text-red-400" : "text-[#55b965]"}>{rates?.[currency] ? "Live" : "—"}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold">Recent conversions</p>
                  <p className="text-[9px] text-slate-400">Your latest saved numbers</p>
                </div>
                <Link to="/money" className="text-[9px] font-semibold text-[#43b34d]">
                  View all rates <ArrowRight size={12} className="inline" />
                </Link>
              </div>

              {convStatus === "loading" ? (
                <div className="p-4 text-xs text-slate-400">Loading…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[9px]">
                    <thead className="bg-slate-50 text-slate-400">
                      <tr>
                        <th className="px-4 py-2">From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Channel</th>
                        <th>Converted</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversions.slice(0, 5).map((c) => (
                        <tr key={c.id} className="border-t border-slate-100">
                          <td className="px-4 py-2">{c.from_currency}</td>
                          <td>{c.to_currency}</td>
                          <td>{Number(c.amount).toLocaleString()}</td>
                          <td>{c.channel || "—"}</td>
                          <td className="font-semibold">{Number(c.converted_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td>{c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { day: "2-digit", month: "short" }) : "—"}</td>
                        </tr>
                      ))}
                      {!conversions.length && (
                        <tr>
                          <td colSpan="6" className="px-4 py-7 text-center text-slate-400">No saved conversions yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold">Upcoming trips</p>
                  <p className="mt-1 text-[9px] text-slate-400">Plan ahead</p>
                </div>
                <Link to="/trips" className="text-[9px] text-[#43b34d]">
                  View all <ChevronRight size={12} className="inline" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {upcoming.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-slate-800">{trip.destination}</p>
                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {trip.days} days · {trip.target_currency}
                      </p>
                    </div>
                    <div className="text-right text-[9px]">
                      <p className="font-semibold text-[#43b34d]">
                        <Countdown date={trip.travel_date} />
                      </p>
                      <p className="text-slate-400">KES {Number(trip.budget_kes).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {!upcoming.length && <p className="py-6 text-center text-[9px] text-slate-400">No upcoming trips.</p>}
              </div>
            </Card>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_.9fr]">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold">Alerts feed</p>
                  <p className="mt-1 text-[9px] text-slate-400">Your active rate watchlist</p>
                </div>
                <Link to="/alerts" className="text-[9px] text-[#43b34d]">
                  Manage <ChevronRight size={12} className="inline" />
                </Link>
              </div>

              <div className="mt-3 space-y-2">
                {alerts.filter((alert) => alert.active).slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2.5">
                    <Bell size={13} className="text-red-400" />
                    <div className="text-[9px] text-slate-600">
                      <span className="font-bold">{alert.from_currency}/{alert.to_currency}</span>
                      <span className="ml-2 text-slate-400">Target {alert.target_rate}</span>
                    </div>
                  </div>
                ))}
                {!alerts.filter((alert) => alert.active).length && (
                  <p className="py-4 text-center text-[9px] text-slate-400">No active alerts.</p>
                )}
              </div>
            </Card>

            <Card className="flex items-center justify-between p-4">
              <div>
                <p className="text-[10px] font-bold">Make a smarter decision</p>
                <p className="mt-1 max-w-md text-[9px] leading-4 text-slate-400">
                  Compare your amount, understand what changed, and set an alert before your money moves.
                </p>
              </div>
              <Link to="/money" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#55c94b] text-white">
                <ChevronRight size={15} />
              </Link>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
