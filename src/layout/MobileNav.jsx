import { NavLink } from "react-router-dom";
import { nav } from "./nav";

export default function MobileNav() {
  return (
    <nav className="ticket fixed bottom-3 left-3 right-3 z-50 flex justify-around p-2 lg:hidden">
      {nav.slice(0, 5).map(([path, label, Icon]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[9px] ${isActive ? "bg-lime text-ink" : "text-paper/60"}`
          }
        >
          <Icon size={16} />
          {label.split(" ")[0]}
        </NavLink>
      ))}
    </nav>
  );
}
