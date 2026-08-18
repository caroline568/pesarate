const BASE_URL = "https://open.er-api.com/v6/latest";

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