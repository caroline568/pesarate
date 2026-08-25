import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { to: "/convert", label: "Convert", icon: "ti-arrows-exchange" },
  { to: "/understand", label: "Understand", icon: "ti-chart-line" },
  { to: "/monitor", label: "Monitor", icon: "ti-bell" },
  { to: "/save", label: "Save", icon: "ti-star" },
  { to: "/explore", label: "Explore", icon: "ti-world" },
  { to: "/plan", label: "Plan", icon: "ti-plane" },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex">
      <aside className="w-56 border-r border-white/10 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
            <i className="ti ti-coin text-black text-lg" />
          </div>
          <span className="font-medium">PesaRate</span>
        </div>

        <p className="text-xs text-white/40 mb-2 uppercase tracking-wide">Workspace</p>
        <nav className="flex flex-col gap-1 mb-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                }`
              }
            >
              <i className={`ti ${item.icon} text-base`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70">
            <i className="ti ti-search text-base" />
            Search currencies, countries...
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-white/10 px-2 py-1 rounded-md">KES · Kenya Shilling</span>
            <i className="ti ti-bell text-white/60" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}