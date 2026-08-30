import { Link, Outlet, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import RateTicker from "../components/RateTicker";
import { nav } from "./nav";
import logo from "../assets/pesarate-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function AppShell() {
  const location = useLocation();
  const { user } = useAuth();
  const title = nav.find(([path]) => location.pathname.startsWith(path))?.[1] || "Workspace";

  return (
    <div className="bureau-bg min-h-screen bg-ink text-paper">
      <Sidebar />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <img src={logo} alt="PesaRate" className="h-9 w-9 rounded-lg object-cover lg:hidden" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="hidden text-[10px] text-paper/40 sm:block">Financial intelligence workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-paper/60 sm:flex">
                <Search size={14} /> Search
              </button>
              <div className="hidden rounded-full border border-line px-3 py-2 font-mono text-[10px] font-medium text-lime sm:block">
                LIVE
              </div>
              <Link
                to="/profile"
                aria-label="Your profile"
                className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-lime/40 bg-paper/10"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-lime">
                    {(user?.name || user?.email || "?")[0]?.toUpperCase()}
                  </span>
                )}
              </Link>
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
