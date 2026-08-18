import { useState } from "react";
import { getRates } from "../api";
import ComparisonTable from "../components/ComparisonTable";

export default function CalculatorPage() {
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [quotedRate, setQuotedRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRates(amount, currency);
      setResult(data);
    } catch {
      setError("Couldn't fetch the rate. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const quotedDiff =
    result && quotedRate
      ? (result.rate - parseFloat(quotedRate)) * amount
      : null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Rate Calculator</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check rate"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {result && (
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <p className="text-slate-700">
              Mid-market rate: <span className="font-semibold">1 {currency} = {result.rate} KES</span>
            </p>
            <p className="text-slate-700">
              You'd get: <span className="font-semibold">{result.converted.toFixed(2)} KES</span>
            </p>

            <input
              type="number"
              placeholder="Rate your channel quoted you"
              value={quotedRate}
              onChange={(e) => setQuotedRate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {quotedDiff !== null && (
              <p className={quotedDiff > 0 ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>
                {quotedDiff > 0
                  ? `You're losing ~${quotedDiff.toFixed(2)} KES to markup`
                  : "That rate looks fair or better than mid-market"}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <ComparisonTable />
      </div>
    </div>
  );
}