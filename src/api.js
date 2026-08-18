const BASE_URL = "https://open.er-api.com/v6/latest";

// Fetches the live mid-market exchange rate from the given currency to KES,
// and returns both the raw rate and the converted amount so components
// don't need to repeat that calculation themselves.
export async function getRates(amount, fromCurrency) {
  const response = await fetch(`${BASE_URL}/${fromCurrency}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }
  const data = await response.json();
  const rate = data.rates.KES;
  return {
    rate,
    converted: amount * rate,
  };
}