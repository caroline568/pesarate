import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: "ti-layout-dashboard",
  },
  {
    to: "/money",
    label: "Money",
    icon: "ti-arrows-exchange",
  },
  {
    to: "/rates",
    label: "Rates",
    icon: "ti-chart-line",
  },
  {
    to: "/news",
    label: "News",
    icon: "ti-news",
  },
  {
    to: "/explore",
    label: "Explore",
    icon: "ti-world",
  },
  {
    to: "/monitor",
    label: "Monitor",
    icon: "ti-bell-ringing",
  },
];

function NavigationItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group flex items-center gap-2.5 rounded-xl px-3 py-2.5",
          "text-xs font-medium transition-all duration-300",
          isActive
            ? "bg-[#17201B] text-white shadow-lg"
            : "text-[#6F7A73] hover:bg-white hover:text-[#17201B]",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-lg",
              "transition-all duration-300",
              isActive
                ? "bg-hero-accent text-[#17201B]"
                : "bg-[#F1F4EE] text-[#7C8780] group-hover:bg-[#EAF8D9]",
            ].join(" ")}
          >
            <i className={`ti ${icon} text-sm`} />
          </span>

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#F7F8F5] font-display text-[#17201B]">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-hero-accent/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#DDF5EA]/40 blur-3xl" />
      </div>

      {/* Top branding */}
      <header className="fixed left-0 right-0 top-0 z-50 px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17201B] text-hero-accent shadow-lg transition-transform duration-300 group-hover:scale-105">
              <span className="text-sm font-bold">P</span>
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight">
                PesaRate
              </p>

              <p className="text-[9px] uppercase tracking-[0.18em] text-[#89938C]">
                Financial workspace
              </p>
            </div>
          </NavLink>

          {/* Live status */}
          <div className="flex items-center gap-2 rounded-full border border-black/6 bg-white/75 px-3 py-2 shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>

            <span className="text-[10px] font-medium text-[#68736C]">
              Markets live
            </span>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <main className="relative min-h-screen px-5 pb-32 pt-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Floating glass navigation */}
      <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-2xl border border-black/6 bg-white/80 p-2 shadow-[0_20px_60px_rgba(23,32,27,0.14)] backdrop-blur-2xl">
          {navigation.map((item) => (
            <NavigationItem
              key={item.to}
              {...item}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}