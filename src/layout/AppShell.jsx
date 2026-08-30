import { Bell } from "lucide-react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { nav } from "./nav";
import { useAuth } from "../hooks/useAuth";

export default function AppShell(){
  const location=useLocation(); const {user}=useAuth();
  const current=nav.find(([p])=>location.pathname.startsWith(p));
  const title=current?.[1] || "Dashboard";
  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900"><Sidebar/><div className="lg:ml-[166px]"><header className="h-[66px] border-b border-slate-200 bg-white"><div className="flex h-full items-center justify-between px-4 sm:px-7"><div><h2 className="text-[15px] font-bold">{title}</h2>{title==="Dashboard"&&<p className="text-[9px] text-slate-400">Welcome back, {user?.name || "here’s what’s happening with your money today."}</p>}</div><div className="flex items-center gap-4"><button className="relative text-slate-500"><Bell size={15}/><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-red-500"/></button><Link to="/profile" className="flex items-center gap-2"><span className="grid h-8 w-8 overflow-hidden place-items-center rounded-full bg-[#102a4a] text-[10px] font-bold text-white">{user?.avatar?<img src={user.avatar} alt="" className="h-full w-full object-cover"/>:(user?.name||user?.email||"?")[0].toUpperCase()}</span><span className="hidden text-[10px] font-semibold sm:block">{user?.name || "Profile"}</span><span className="hidden text-[9px] text-slate-400 sm:block">⌄</span></Link></div></div></header><main className="p-4 sm:p-6"><div className="mx-auto max-w-[1180px]"><Outlet/></div></main></div><MobileNav/></div>
}
