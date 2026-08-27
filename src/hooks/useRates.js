import { useEffect, useState } from "react";
import { getRates } from "../api";

/**
 * Live mid-market rates for a base currency.
 * `status` is derived rather than set synchronously in the effect, so a
 * component always renders one of exactly three states: loading, error, ready.
 */
export function useRates(base) {
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getRates(base)
      .then((d) => {
        if (cancelled) return;
        setRates(d.rates || {});
        setLastUpdated(d.lastUpdated || null);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [base, version]);

  const status = error ? "error" : rates ? "ready" : "loading";
  const reload = () => {
    setRates(null);
    setError(false);
    setVersion((v) => v + 1);
  };

  return { rates, lastUpdated, status, reload };
}

export default useRates;
