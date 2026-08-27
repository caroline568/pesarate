import { useRates } from "../hooks/useRates";

const WATCH = ["USD", "GBP", "EUR", "AED", "TZS", "UGX", "ZAR", "CNY"];

/**
 * Signature element: a departure-board style marquee of live KES rates,
 * scrolling like a forex bureau's LED ticker. Purely decorative context —
 * pages fetch their own rates independently.
 */
export default function RateTicker() {
  const { rates, status } = useRates("KES");
  const entries = WATCH.map((c) => ({ code: c, value: rates?.[c] }));
  const row = (keyPrefix) => (
    <div className="ticker-track" key={keyPrefix}>
      {[...entries, ...entries].map((e, i) => (
        <span key={`${keyPrefix}-${e.code}-${i}`} className="flex items-center gap-2 px-5 py-2 font-mono text-xs whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          KES/{e.code}
          <b className="text-marigold">
            {status === "ready" && e.value ? e.value.toFixed(4) : "····"}
          </b>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker-wrap overflow-hidden border-b border-line bg-ink-soft/80" aria-label="Live exchange rate ticker">
      <div className="flex">{row("a")}</div>
    </div>
  );
}
