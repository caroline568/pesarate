/** A labelled amount input paired with a currency selector — the one
 * interaction every money page in PesaRate is built around. */
export default function CurrencyField({ label, code, onCodeChange, amount, onAmountChange, currencies, readOnlyAmount }) {
  return (
    <div className="rounded-2xl bg-paper/[0.06] p-4">
      <label className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/45">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <select
          value={code}
          onChange={(e) => onCodeChange?.(e.target.value)}
          disabled={!onCodeChange}
          className="rounded-lg bg-paper text-ink px-2.5 py-2 text-xs font-bold outline-none disabled:opacity-70"
        >
          {currencies.map((c) => <option key={c}>{c}</option>)}
        </select>
        {readOnlyAmount !== undefined ? (
          <b className="min-w-0 flex-1 truncate text-2xl font-semibold font-[family-name:var(--font-mono)]">
            {readOnlyAmount ?? "—"}
          </b>
        ) : (
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
            className="w-full min-w-0 bg-transparent text-2xl font-semibold outline-none font-[family-name:var(--font-mono)]"
          />
        )}
      </div>
    </div>
  );
}
