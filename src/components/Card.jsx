/** Base "ticket" card — the recurring visual unit of the bureau aesthetic. */
export function Card({ className = "", children, denom }) {
  return (
    <div className={`ticket relative overflow-hidden ${className}`}>
      {denom && (
        <span className="denom pointer-events-none absolute -right-2 -top-4 text-7xl">{denom}</span>
      )}
      {children}
    </div>
  );
}

export function CardEyebrow({ children }) {
  return <p className="font-mono text-[11px] uppercase tracking-[.16em] text-paper/45">{children}</p>;
}

export default Card;
