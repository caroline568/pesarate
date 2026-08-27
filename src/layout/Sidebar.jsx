import { NavLink } from "react-router-dom";
import { nav } from "./nav";

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 border-r border-line bg-ink-soft/90 px-4 py-5 backdrop-blur-2xl lg:block">
      <NavLink to="/dashboard" className="mb-8 flex items-center gap-3 px-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime font-[family-name:var(--font-display)] text-lg font-semibold text-ink stamp">
          P
        </span>
        <div>
          <div className="font-[family-name:var(--font-display)] text-lg font-medium tracking-tight">PesaRate</div>
          <div className="font-mono text-[9px] uppercase tracking-[.2em] text-paper/40">Exchange bureau</div>
        </div>
      </NavLink>
      <div className="space-y-1">
        {nav.map(([path, label, Icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive ? "bg-lime text-ink font-medium shadow-[0_8px_24px_rgba(198,241,53,.18)]" : "text-paper/60 hover:bg-paper/[0.06] hover:text-paper"
              }`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="ticket absolute bottom-5 left-4 right-4 p-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> Markets live
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-paper/45">
          Rates refresh from live market sources. PesaRate adds the context.
        </p>
      </div>
    </aside>
  );
}
