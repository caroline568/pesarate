// Frankfurter (our historical data source) tracks ECB reference rates, so
// only these are chartable — KES and regional currencies (TZS/UGX/ZAR/AED)
// aren't covered by any free, keyless historical API we could verify as
// reliable. Kept in its own file (not HistoricalChart.jsx) so that file can
// export only the component, which React Fast Refresh requires.
export const CHARTABLE_CURRENCIES = ["USD", "GBP", "EUR", "JPY", "CHF", "AUD", "CAD", "CNY", "INR"];
