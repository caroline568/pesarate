import { NavLink } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { nav } from "./nav";
import logo from "../assets/pesarate-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, status, logout } = useAuth();

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 border-r border-line bg-ink-soft/90 px-4 py-5 backdrop-blur-2xl lg:block">
      <NavLink to="/dashboard" className="mb-8 flex items-center gap-3 px-3">
        <img src={logo} alt="PesaRate" className="h-10 w-10 rounded-xl object-cover" />
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
        {status === "signed-in" ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 text-xs font-medium">
              <User size={14} className="shrink-0 text-lime" />
              <span className="truncate">{user?.name || user?.email}</span>
            </div>
            <button onClick={logout} aria-label="Sign out" className="shrink-0 text-paper/50 hover:text-coral">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> Markets live
            </div>
            <NavLink to="/login" className="mt-3 block rounded-lg bg-lime py-2 text-center text-xs font-semibold text-ink">
              Sign in to sync
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}
