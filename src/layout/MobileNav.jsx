import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { nav } from "./nav";
import logo from "../assets/pesarate-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <NavLink
          to="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <img
            src={logo}
            alt="PesaRate"
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-[16px] font-bold text-[#061d3a]">
            Pesa<span className="text-[#49c85b]">Rate</span>
          </span>
        </NavLink>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#061d3a] transition hover:bg-slate-100"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-16 z-50 w-[min(85vw,320px)] rounded-bl-2xl border-b border-l border-slate-200 bg-[#061d3a] p-3 text-white shadow-2xl transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="space-y-1">
          {nav.map(([path, label, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-[#55c94b] text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-3 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[11px] text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          <div className="truncate px-3 pt-1 text-[9px] text-white/35">
            {user?.email}
          </div>
        </div>
      </aside>
    </>
  );
}
