import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Bell,
  Save,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getHistoricalRange } from "../api";
import { conversionsApi } from "../api-client";
import { useRates } from "../hooks/useRates";
import { useSavedConversions } from "../hooks/useSavedConversions";
import { Card } from "../components/Card";
import PageHeader from "../components/PageHeader";

const CURRENCIES = [
  "KES",
  "USD",
  "GBP",
  "EUR",
  "AED",
  "TZS",
  "UGX",
  "ZAR",
];

const CHANNELS = ["Remitly", "Wise", "Bank", "M-Pesa", "Cash pickup"];

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(Number(value))) {
    return "—";
  }

  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatSigned(value) {
  const num = Number(value || 0);

  return (num >= 0 ? "+" : "-") + formatNumber(Math.abs(num), 2);
}

export default function Convert() {
  const [amount, setAmount] = useState(100000);
  const [from, setFrom] = useState("KES");
  const [to, setTo] = useState("USD");
  const [editing, setEditing] = useState(null);
  const [channel, setChannel] = useState("Remitly");

  const [history, setHistory] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonError, setComparisonError] = useState("");
  const activeComparisonError = comparisonError || "";

  /*
   * Compact channel-comparison table.
   *
   * Keyed by channel name so a single failed/pending channel never
   * blocks the others from rendering. Uses the same compare endpoint
   * as the primary conversion, just called once per channel.
   */
  const [channelComparisons, setChannelComparisons] = useState({});
  const [channelComparisonsLoading, setChannelComparisonsLoading] =
    useState(false);

  const { rates } = useRates(from);
  const { items = [], add, update } = useSavedConversions();

  /*
   * Historical market-rate data.
   *
   * This is kept separate from provider comparison because
   * "What changed" should describe currency movement rather
   * than provider pricing.
   */
  useEffect(() => {
    if (from === to) {
      return;
    }

    let active = true;

    getHistoricalRange(from, to, "1W")
      .then((data) => {
        if (active) {
          setHistory(data);
        }
      })
      .catch(() => {
        if (active) {
          setHistory(null);
        }
      });

    return () => {
      active = false;
    };
  }, [from, to]);

  /*
   * Provider comparison.
   *
   * Provider pricing is an enhancement to the core converter.
   * If the provider has no usable quote, the market-rate
   * conversion remains available.
   */
  useEffect(() => {
    if (from === to || !amount || amount <= 0) {
      return;
    }

    let active = true;

    setComparison(null);
    setComparisonError("");

    conversionsApi
      .compare({
        from,
        to,
        amount,
        channel,
      })
      .then((data) => {
        if (!active) {
          return;
        }

        setComparison(data?.comparison || null);

        if (!data?.comparison) {
          setComparisonError(
            "Provider pricing is unavailable right now. Using the current market rate."
          );
        }
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setComparison(null);
        setComparisonError(
          "Provider pricing is unavailable right now. Using the current market rate."
        );
      });

    return () => {
      active = false;
    };
  }, [amount, from, to, channel]);

  /*
   * Channel comparison table.
   *
   * Independent of the selected channel — runs the same compare
   * endpoint for every supported channel so the user can see how
   * the currently selected channel stacks up against the rest.
   */
  useEffect(() => {
    if (from === to || !amount || amount <= 0) {
      setChannelComparisons({});
      setChannelComparisonsLoading(false);
      return;
    }

    let active = true;
    setChannelComparisonsLoading(true);

    Promise.allSettled(
      CHANNELS.map((ch) =>
        conversionsApi
          .compare({ from, to, amount, channel: ch })
          .then((data) => ({ channel: ch, comparison: data?.comparison || null }))
      )
    ).then((results) => {
      if (!active) {
        return;
      }

      const next = {};
      results.forEach((settled, index) => {
        const ch = CHANNELS[index];
        next[ch] =
          settled.status === "fulfilled" ? settled.value.comparison : null;
      });

      setChannelComparisons(next);
      setChannelComparisonsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [amount, from, to]);

  /*
   * Core market rate.
   *
   * This is always the fallback and should remain available
   * even when provider comparison is unavailable.
   */
  const marketRate = from === to ? 1 : rates?.[to];

  /*
   * Same-currency conversion does not need a backend provider
   * comparison.
   */
  const sameCurrencyComparison =
    from === to
      ? {
          provider: {
            name: channel,
            alias: channel,
          },
          providerRate: 1,
          providerResult: Number(amount),
          sourceCurrency: from,
          targetCurrency: to,
          amount: Number(amount),
          channel,
        }
      : null;

  const activeComparison =
    amount > 0
      ? comparison || sameCurrencyComparison
      : sameCurrencyComparison;

  const activeHistory =
    from === to
      ? {
          first: 1,
          last: 1,
        }
      : history;

  /*
   * Provider comparison is considered loading only while there
   * is no provider result and no comparison error.
   */
  const comparisonMatchesSelection =
    comparison &&
    comparison.sourceCurrency === from &&
    comparison.targetCurrency === to &&
    Number(comparison.amount) === Number(amount) &&
    comparison.channel === channel;

  const comparisonLoading =
    from !== to &&
    amount > 0 &&
    !comparisonError &&
    !comparisonMatchesSelection;

  /*
   * Provider-specific values returned by the Flask backend.
   *
   * These are:
   *   providerRate
   *   providerResult
   */
  const providerRate = Number(activeComparison?.providerRate);
  const providerResult = Number(activeComparison?.providerResult);

  /*
   * Use the provider rate only when the backend returned a valid
   * provider quote. Otherwise, fall back to the live market rate.
   */
  const rate =
    Number.isFinite(providerRate) && providerRate > 0
      ? providerRate
      : marketRate;

  /*
   * Use the provider's converted result when available.
   * Otherwise calculate directly from the market rate.
   */
  const result =
    Number.isFinite(providerResult) && providerResult >= 0
      ? providerResult
      : Number.isFinite(rate)
        ? Number(amount) * Number(rate)
        : 0

  /*
   * Historical comparison always uses the market rate.
   * Provider pricing should not distort "What changed".
   */
  const compareValue = activeHistory?.first
    ? Number(amount) * Number(activeHistory.first)
    : marketRate
      ? Number(amount) * Number(marketRate)
      : 0;

  const changeValue = result - compareValue;

  const hasValidResult =
    !comparisonLoading &&
    Number.isFinite(Number(result)) &&
    Number(result) >= 0 &&
    Number.isFinite(rate);

  /*
   * Best channel across the comparison table, by final recipient
   * amount. Only considers channels that returned a usable quote.
   */
  const bestChannel = useMemo(() => {
    let best = null;

    Object.entries(channelComparisons).forEach(([ch, data]) => {
      const received = Number(data?.providerResult);

      if (!data || !Number.isFinite(received)) {
        return;
      }

      if (!best || received > Number(best.data.providerResult)) {
        best = { channel: ch, data };
      }
    });

    return best;
  }, [channelComparisons]);

  const summary = useMemo(() => {
    if (comparisonLoading) {
      return "Checking " + channel + " pricing for your " + from + " to " + to + " conversion…";
    }

    if (!rate || !Number.isFinite(rate)) {
      return "We need a current rate to calculate this conversion.";
    }

    if (activeComparisonError) {
      return `Your ${formatNumber(
        amount,
        0
      )} ${from} is worth about ${formatNumber(
        result,
        2
      )} ${to} at the current market rate. Provider pricing is unavailable right now.`;
    }

    if (from === to) {
      return `You are converting ${formatNumber(
        amount,
        0
      )} ${from} to the same currency, so the value remains ${formatNumber(
        result,
        2
      )} ${to}.`;
    }

    if (Math.abs(changeValue) < 0.01) {
      return `Your ${formatNumber(
        amount,
        0
      )} ${from} is worth about ${formatNumber(
        result,
        2
      )} ${to} through ${channel}. There is no major change from last week.`;
    }

    return `Your ${formatNumber(
      amount,
      0
    )} ${from} is worth about ${formatNumber(
      result,
      2
    )} ${to} through ${channel}. That is ${formatNumber(
      Math.abs(changeValue),
      2
    )} ${to} ${changeValue >= 0 ? "more" : "less"} than the comparison value from last week.`;
  }, [
    amount,
    channel,
    changeValue,
    activeComparisonError,
    comparisonLoading,
    from,
    rate,
    result,
    to,
  ]);

  const save = async () => {
    if (!hasValidResult || !rate) {
      return;
    }

    const payload = {
      from,
      to,
      amount: Number(amount),
      rate: Number(rate),
      value: Number(result),
      channel,
    };

    try {
      if (editing) {
        await update(editing, payload);
        setEditing(null);
      } else {
        await add(payload);
      }
    } catch (error) {
      console.error("Unable to save conversion:", error?.message || error);
    }
  };

  const edit = (conversion) => {
    setEditing(conversion.id);
    setAmount(Number(conversion.amount));
    setFrom(conversion.from_currency);
    setTo(conversion.to_currency);
    setChannel(conversion.channel || "Remitly");
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
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
          {/* Currency conversion inputs */}
          <div className="grid items-center gap-2 md:grid-cols-[1fr_40px_1fr]">
            {/* Source currency */}
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-[9px] text-slate-400">You have</p>

              <div className="mt-2 flex items-center gap-2">
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded-md bg-slate-100 px-2 py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <input
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setAmount(0);
                      return;
                    }

                    setAmount(Number(value));
                  }}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full text-right text-2xl font-bold outline-none"
                  aria-label="Amount to convert"
                />
              </div>
            </div>

            {/* Swap currencies */}
            <button
              type="button"
              onClick={swapCurrencies}
              className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#55c94b] text-white transition hover:opacity-90"
              aria-label="Swap currencies"
            >
              <ArrowLeftRight size={15} />
            </button>

            {/* Destination currency */}
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-[9px] text-slate-400">It is worth</p>

              <div className="mt-2 flex items-center gap-2">
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="rounded-md bg-slate-100 px-2 py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <div className="w-full text-right text-2xl font-bold text-slate-900">
                  {comparisonLoading ? (
                    <span className="inline-flex items-center gap-2 text-slate-400">
                      <Loader2 size={18} className="animate-spin" />
                    </span>
                  ) : hasValidResult ? (
                    formatNumber(result, 2)
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {activeComparison?.provider && !activeComparisonError && (
                <p className="mt-1 text-right text-[9px] text-slate-400">
                  Based on{" "}
                  {activeComparison.provider.name ||
                    activeComparison.provider.alias ||
                    channel}{" "}
                  pricing
                </p>
              )}
            </div>
          </div>

          {/* Rate information */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] text-slate-400">Current rate</p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  1 {from} = {rate ? formatNumber(rate, 4) : "—"} {to}
                </p>

                {activeComparison?.provider && !activeComparisonError && (
                  <p className="mt-1 text-[9px] text-slate-400">
                    {activeComparison.provider.name ||
                      activeComparison.provider.alias ||
                      channel}{" "}
                    provider rate
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-[9px] text-slate-400">What changed</p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    changeValue >= 0 ? "text-[#43b34d]" : "text-red-500"
                  }`}
                >
                  {comparisonLoading
                    ? "—"
                    : `${formatSigned(changeValue)} ${to}`}
                </p>
              </div>
            </div>

            {/* Provider comparison status */}
            {activeComparisonError && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-[9px] font-semibold text-slate-600">
                  Market rate shown
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  {comparisonError ||
                    "Provider pricing is unavailable right now. Your conversion still uses the current market rate."}
                </p>
              </div>
            )}

            {/* Meaning */}
            <div className="mt-4 rounded-lg bg-white p-3">
              <p className="text-[9px] text-slate-400">What this means</p>

              <p className="mt-2 text-[11px] leading-5 text-slate-600">
                {summary}
              </p>
            </div>
          </div>

          {/* Transaction breakdown */}
          {comparisonMatchesSelection && !activeComparisonError && comparison && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] font-bold text-slate-700">
                Transaction breakdown
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                How your {formatNumber(amount, 0)} {from} → {to} conversion
                through {comparison.provider?.name || channel} is calculated.
              </p>

              <div className="mt-3 divide-y divide-slate-100">
                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    Mid-market exchange rate
                  </p>
                  <p className="text-[10px] font-semibold text-slate-800">
                    1 {from} = {formatNumber(comparison.midMarketRate, 4)} {to}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    {comparison.provider?.name || channel} exchange rate
                  </p>
                  <p className="text-[10px] font-semibold text-slate-800">
                    1 {from} = {formatNumber(comparison.providerRate, 4)} {to}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    Channel fee (total cost)
                  </p>
                  <p className="text-[10px] font-semibold text-slate-800">
                    {formatNumber(comparison.fee, 2)}{" "}
                    {comparison.feeCurrency || from}
                    {Number.isFinite(Number(comparison.feePercent))
                      ? ` (${formatNumber(comparison.feePercent, 2)}%)`
                      : ""}
                  </p>
                </div>

                {Number.isFinite(Number(comparison.markupPercent)) && (
                  <div className="flex items-center justify-between gap-3 py-2">
                    <p className="text-[9px] text-slate-400">FX markup</p>
                    <p className="text-[10px] font-semibold text-slate-800">
                      {formatNumber(comparison.markupPercent, 2)}%
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    Amount after fees
                  </p>
                  <p className="text-[10px] font-semibold text-slate-800">
                    {formatNumber(comparison.amountAfterFee, 2)} {from}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    Final amount recipient receives
                  </p>
                  <p className="text-[11px] font-bold text-[#43b34d]">
                    {formatNumber(comparison.providerResult, 2)} {to}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 py-2">
                  <p className="text-[9px] text-slate-400">
                    Cost vs. mid-market conversion
                  </p>
                  <p className="text-[10px] font-semibold text-red-500">
                    -{formatNumber(comparison.difference, 2)} {to}
                    {Number.isFinite(Number(comparison.costPercent))
                      ? ` (${formatNumber(comparison.costPercent, 2)}%)`
                      : ""}
                  </p>
                </div>
              </div>

              {comparison.isMockPricing && comparison.comparisonDisclaimer && (
                <p className="mt-3 text-[8px] leading-4 text-slate-400">
                  {comparison.comparisonDisclaimer}
                </p>
              )}
            </div>
          )}

          {/* Compare channels */}
          {from !== to && amount > 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-700">
                    Compare channels
                  </p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    {formatNumber(amount, 0)} {from} → {to} across available
                    channels.
                  </p>
                </div>

                {channelComparisonsLoading && (
                  <Loader2 size={14} className="animate-spin text-slate-400" />
                )}
              </div>

              <div className="mt-3 space-y-2">
                {CHANNELS.map((ch) => {
                  const data = channelComparisons[ch];
                  const isBest = bestChannel?.channel === ch;
                  const isSelected = ch === channel;

                  return (
                    <div
                      key={ch}
                      className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                        isBest
                          ? "border-[#55c94b] bg-[#55c94b]/5"
                          : "border-slate-200"
                      }`}
                    >
                      <div>
                        <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-800">
                          {ch}

                          {isBest && (
                            <span className="rounded-full bg-[#55c94b] px-1.5 py-0.5 text-[7px] font-bold uppercase text-white">
                              Best value
                            </span>
                          )}

                          {isSelected && !isBest && (
                            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[7px] font-bold uppercase text-slate-600">
                              Selected
                            </span>
                          )}
                        </p>

                        <p className="mt-1 text-[8px] text-slate-400">
                          {data
                            ? `Fee ${formatNumber(data.fee, 2)} ${
                                data.feeCurrency || from
                              } · Rate 1 ${from} = ${formatNumber(
                                data.providerRate,
                                4
                              )} ${to}`
                            : channelComparisonsLoading
                              ? "Checking pricing…"
                              : "Pricing unavailable"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-900">
                          {data
                            ? `${formatNumber(data.providerResult, 2)} ${to}`
                            : "—"}
                        </p>

                        {!isSelected && (
                          <button
                            type="button"
                            onClick={() => setChannel(ch)}
                            className="mt-1 text-[8px] font-semibold text-[#43b34d] hover:underline"
                          >
                            Use this channel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={!hasValidResult || comparisonLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#55c94b] px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} />

              {editing ? "Update conversion" : "Save conversion"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

            {/* Provider selector */}
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-700 outline-none focus:border-[#55c94b]"
              aria-label="Transfer provider"
            >
              {CHANNELS.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>

            <Link
              to="/alerts"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Bell size={12} />
              Set an alert
            </Link>
          </div>

          {/* Provider status */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                comparisonLoading
                  ? "bg-amber-400"
                  : activeComparisonError
                    ? "bg-slate-400"
                    : "bg-[#55c94b]"
              }`}
            />

            <p className="text-[9px] text-slate-400">
              {comparisonLoading
                ? "Checking " + channel + " pricing…"
                : activeComparisonError
                  ? "Using the current market rate"
                  : channel + " pricing applied to this conversion"}
            </p>
          </div>
        </Card>

        {/* Saved conversions */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[10px] font-bold">Saved conversions</p>

            <p className="mt-1 text-[9px] text-slate-400">
              Recent values you can review or edit.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-[10px] font-semibold text-slate-800">
                    {item.from_currency} {formatNumber(item.amount, 0)} →{" "}
                    {item.to_currency}{" "}
                    {formatNumber(item.converted_value, 2)}
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    {item.channel || "Remitly"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => edit(item)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[8px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
              </div>
            ))}

            {!items.length && (
              <p className="p-6 text-center text-[9px] text-slate-400">
                No saved conversions yet.
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold">Quick check</p>

                <p className="text-[9px] text-slate-400">
                  Know the rate before you move money.
                </p>
              </div>

              <ArrowRight size={14} className="text-[#43b34d]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

