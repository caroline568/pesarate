import { Outlet, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import RateTicker from "../components/RateTicker";
import { nav } from "./nav";

export default function AppShell() {
  const location = useLocation();
  const title = nav.find(([path]) => location.pathname.startsWith(path))?.[1] || "Workspace";

  return (
    <div className="bureau-bg min-h-screen bg-ink text-paper">
      <Sidebar />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lime font-[family-name:var(--font-display)] font-semibold text-ink lg:hidden">
                P
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="hidden text-[10px] text-paper/40 sm:block">Financial intelligence workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-paper/60 sm:flex">
                <Search size={14} /> Search
              </button>
              <div className="rounded-full border border-line px-3 py-2 font-mono text-[10px] font-medium text-lime">LIVE</div>
            </div>
          </div>
          <RateTicker />
        </header>
        <main className="px-4 pb-24 pt-8 sm:px-7 lg:pb-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
