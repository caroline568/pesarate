const RATE_BASE = "https://open.er-api.com/v6/latest";
const HISTORY_BASE = "https://api.frankfurter.dev/v1";
const COUNTRIES_BASE = "https://restcountries.com/v3.1/currency";
const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

const RANGE_DAYS = { "1W": 7, "1M": 30, "3M": 90, "1Y": 365 };

// Live rates for a base currency. Returns the full rates object plus a
// last-updated timestamp, so callers can look up any target currency.
export async function getRates(fromCurrency) {
  const response = await fetch(`${RATE_BASE}/${fromCurrency}`);
  if (!response.ok) throw new Error("Failed to fetch exchange rate");
  const data = await response.json();
  return { rates: data.rates, lastUpdated: data.time_last_update_utc };
}

// Historical range for a currency pair, used for trend charts.
// Frankfurter only covers ECB-tracked currencies (not KES) — when a pair
// isn't supported, this returns null rather than fabricating data.
export async function getHistoricalRange(fromCurrency, toCurrency, rangeKey) {
  const days = RANGE_DAYS[rangeKey] ?? 7;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];

  try {
    const response = await fetch(
      `${HISTORY_BASE}/${startStr}..${endStr}?base=${fromCurrency}&symbols=${toCurrency}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const entries = Object.entries(data.rates || {}).sort(([a], [b]) => a.localeCompare(b));
    if (entries.length < 2) return null;

    const points = entries.map(([date, r]) => ({ date, value: r[toCurrency] }));
    const first = points[0].value;
    const last = points[points.length - 1].value;
    const high = Math.max(...points.map((p) => p.value));
    const low = Math.min(...points.map((p) => p.value));
    const changePercent = ((last - first) / first) * 100;

    return { points, first, last, high, low, changePercent };
  } catch {
    return null;
  }
}

// Country + currency metadata: flag, name, region — used in Explore and
// the currency picker. Cached per session since this data barely changes.
const countryCache = {};
export async function getCurrencyInfo(code) {
  if (countryCache[code]) return countryCache[code];
  try {
    const response = await fetch(`${COUNTRIES_BASE}/${code}`);
    if (!response.ok) return null;
    const data = await response.json();
    const info = {
      flag: data[0]?.flags?.svg,
      country: data[0]?.name?.common,
      currencyName: data[0]?.currencies?.[code]?.name,
      region: data[0]?.region,
      capital: data[0]?.capital?.[0],
      latlng: data[0]?.capitalInfo?.latlng,
    };
    countryCache[code] = info;
    return info;
  } catch {
    return null;
  }
}

// Current weather for a location, used in Plan (travel context).
// Open-Meteo is free, no key required.
export async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `${WEATHER_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return {
      temperature: data.current?.temperature_2m,
      weatherCode: data.current?.weather_code,
    };
  } catch {
    return null;
  }
}