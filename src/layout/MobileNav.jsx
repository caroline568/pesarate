import { NavLink } from "react-router-dom";
import { nav } from "./nav";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-2 left-2 right-2 z-50 grid grid-cols-6 gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl lg:hidden">
      {nav.map(([path, label, Icon]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[8px] ${
              isActive ? "bg-[#55c94b] text-white" : "text-slate-500"
            }`
          }
        >
          <Icon size={15} />
          {label.split(" ")[0]}
        </NavLink>
      ))}
    </nav>
  );
}
