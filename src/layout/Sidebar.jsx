import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { nav } from "./nav";
import logo from "../assets/pesarate-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-[166px] border-r border-slate-200 bg-[#061d3a] px-3 py-5 text-white lg:block">
    <NavLink to="/dashboard" className="mb-8 flex items-center gap-2 px-2"><img src={logo} alt="PesaRate" className="h-7 w-7 rounded-lg" /><span className="text-[15px] font-bold">Pesa<span className="text-[#49c85b]">Rate</span></span></NavLink>
    <nav className="space-y-1">{nav.map(([path, label, Icon]) => <NavLink key={path} to={path} className={({isActive}) => `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-medium transition ${isActive ? "bg-[#55c94b] text-white shadow-sm" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon size={14}/><span>{label}</span></NavLink>)}</nav>
    <div className="absolute bottom-5 left-3 right-3"><button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-white/60 hover:bg-white/10 hover:text-white"><LogOut size={14}/> Logout</button><div className="mt-2 truncate px-3 text-[9px] text-white/35">{user?.email}</div></div>
  </aside>;
}
