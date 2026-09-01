import { ArrowLeftRight, ArrowRight, Bell, LayoutDashboard, Plane, ShieldCheck, TrendingUp, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/pesarate-logo.png";

const features = [
  { icon: LayoutDashboard, title: "Live KES rates", desc: "See real-time exchange rates the moment you land, with your saved conversions and trips right on the dashboard." },
  { icon: ArrowLeftRight, title: "Smart conversion", desc: "Convert between currencies, compare provider channels, and keep a running history you can edit anytime." },
  { icon: Plane, title: "Trip-ready budgets", desc: "Plan travel money ahead of time with a countdown to your travel date and a live converted budget." },
  { icon: TrendingUp, title: "Trends & news", desc: "Historical charts paired with editorial context, so a rate move actually means something." },
  { icon: Bell, title: "Rate alerts", desc: "Set a target rate for any currency pair and get notified instead of checking the market yourself." },
  { icon: UserRound, title: "One profile, everywhere", desc: "Your account, saved conversions, and trips follow you across every device you sign in on." },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#031933]">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PesaRate" className="h-8 w-8 rounded-lg" />
            <span className="text-[15px] font-bold text-white">Pesa<span className="text-[#55c94b]">Rate</span></span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:text-white sm:px-4">Login</Link>
            <Link to="/signup" className="rounded-lg bg-[#55c94b] px-3 py-2 text-xs font-bold text-white hover:bg-[#4bb943] sm:px-4">Sign Up</Link>
          </nav>
        </div>
      </header>

      <section className="auth-bg">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#55c94b]">Currency &amp; travel money</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">Know the value of your money.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">Live exchange rates, smart conversions, and travel budgets in one place, so every currency decision is backed by real data.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="flex items-center gap-1.5 rounded-lg bg-[#55c94b] px-5 py-3 text-xs font-bold text-white hover:bg-[#4bb943]">Get started free <ArrowRight size={14} /></Link>
              <Link to="/login" className="rounded-lg border border-white/25 px-5 py-3 text-xs font-bold text-white hover:bg-white/10">Login</Link>
            </div>
            <div className="mt-9 flex items-center gap-2 text-[10px] text-white/50"><ShieldCheck size={14} className="text-[#55c94b]" /> No card required — create a free account in seconds.</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Everything in one workspace</p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">Built for people managing money across currencies.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#102a4a] text-[#55c94b]"><Icon size={16} /></div>
              <h3 className="mt-4 text-[13px] font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#031933] p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">Ready to take control of your money?</h2>
            <p className="mt-2 max-w-md text-xs text-white/60">Join PesaRate and get live rates, saved conversions, and trip budgets from day one.</p>
          </div>
          <Link to="/signup" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#55c94b] px-5 py-3 text-xs font-bold text-white hover:bg-[#4bb943]">Create your account <ArrowRight size={14} /></Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2"><img src={logo} alt="PesaRate" className="h-6 w-6 rounded-md" /><span className="text-xs font-bold">Pesa<span className="text-[#55c94b]">Rate</span></span></div>
          <p className="text-[10px] text-slate-400">© 2026 PesaRate. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
