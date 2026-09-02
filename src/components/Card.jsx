export function Card({ className = "", children }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardEyebrow({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">
      {children}
    </p>
  );
}

export default Card;
