import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { nav } from "./nav";
import { useAuth } from "../hooks/useAuth";
import { setWelcomeMessage, shouldShowWelcomeMessage } from "../utils/personalization";

const confettiPieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 7) % 100}%`,
  delay: `${(index % 6) * 0.08}s`,
  color: ["#55c94b", "#1d4ed8", "#f59e0b", "#ef4444", "#a855f7", "#0ea5e9"][index % 6],
  duration: `${1.4 + (index % 5) * 0.2}s`,
}));

export default function AppShell(){
  const location=useLocation(); const {user}=useAuth();
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcomeMessage());
  const current=nav.find(([p])=>location.pathname.startsWith(p));
  const title=current?.[1] || "Dashboard";

  useEffect(() => {
    if (!showWelcome) return;
    const timer = window.setTimeout(() => {
      setShowWelcome(false);
      setWelcomeMessage(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [showWelcome]);

  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900"><Sidebar/><div className="lg:ml-41.5"><header className="h-16.5 border-b border-slate-200 bg-white"><div className="flex h-full items-center justify-between px-4 sm:px-7"><div><h2 className="text-[15px] font-bold">{title}</h2>{title==="Dashboard"&&<p className="text-[9px] text-slate-400">Welcome back, {user?.name || "here’s what’s happening with your money today."}</p>}</div><div className="flex items-center gap-4"><button className="relative text-slate-500"><Bell size={15}/><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-red-500"/></button><Link to="/profile" className="flex items-center gap-2"><span className="grid h-8 w-8 overflow-hidden place-items-center rounded-full bg-[#102a4a] text-[10px] font-bold text-white">{user?.avatar?<img src={user.avatar} alt="" className="h-full w-full object-cover"/>:(user?.name||user?.email||"?")[0].toUpperCase()}</span><span className="hidden text-[10px] font-semibold sm:block">{user?.name || "Profile"}</span><span className="hidden text-[9px] text-slate-400 sm:block">⌄</span></Link></div></div></header><main className="p-4 sm:p-6"><div className="mx-auto max-w-295"><Outlet/></div></main></div><MobileNav/>{showWelcome&&<div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center"><div className="relative overflow-hidden rounded-full bg-white/85 px-5 py-3 shadow-lg ring-1 ring-slate-200 backdrop-blur-md"><div className="absolute inset-0 opacity-60" aria-hidden="true">{confettiPieces.map((piece)=><span key={piece.id} className="confetti-piece" style={{left:piece.left, animationDelay:piece.delay, background:piece.color, animationDuration:piece.duration}}/>)}</div><div className="relative text-sm font-semibold text-slate-800">Welcome to PesaRate</div></div></div>}</div>
}
