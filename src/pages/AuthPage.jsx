import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/pesarate-logo.png";
import "../styles/auth.css";

const USE_CASES = [
  { id: "traveller", label: "Traveller", detail: "Plan spending abroad" },
  { id: "freelancer", label: "Freelancer / international payments", detail: "Get paid across borders" },
  { id: "remote-worker", label: "Remote worker", detail: "Track income in currencies" },
  { id: "exchange", label: "Currency exchange", detail: "Compare rates with clarity" },
];

export default function AuthPage({ mode = "login" }) {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(() => params.get("mode") || mode);
  const nav = useNavigate();
  const { login, register, updateProfile, status } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [useCases, setUseCases] = useState([]);

  useEffect(() => { if (status === "signed-in" && !onboarding) nav("/dashboard", { replace: true }); }, [status, onboarding, nav]);

  const switchTab = (next) => { setTab(next); setError(""); setNotice(""); nav(next === "login" ? "/login" : "/signup", { replace: true }); };
  const toggleUseCase = (id) => setUseCases((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const submit = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (password.length < 8) { setError("Your password must be at least 8 characters."); return; }
    if (tab === "signup" && !name.trim()) { setError("Please enter your name."); return; }
    setBusy(true);
    try {
      if (tab === "login") { await login(email, password, remember); nav("/dashboard", { replace: true }); }
      else { await register(email, password, name.trim(), remember); setOnboarding(true); }
    } catch (err) { setError(err.message); setBusy(false); }
  };
  const finishOnboarding = async () => {
    setBusy(true);
    try { await updateProfile({ use_cases: useCases }); nav("/dashboard", { replace: true }); }
    catch (err) { setError(err.message); setBusy(false); }
  };

  return <main className="auth-bg min-h-screen px-4 py-6 sm:px-8"><div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-330 items-center justify-center"><div className="auth-frame grid w-full overflow-hidden rounded-[28px] border border-white/20 shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
    <section className="auth-story relative hidden min-h-170 flex-col justify-between p-10 text-white lg:flex"><div className="flex items-center gap-2"><img src={logo} alt="PesaRate" className="h-9 w-9 rounded-lg"/><b className="text-xl">Pesa<span className="text-[#55c94b]">Rate</span></b></div><div className="max-w-lg"><p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#a9df9f]">Your money. Your currencies. Your decisions.</p><h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight">See the value<br/>behind every rate.</h1><p className="mt-5 max-w-sm text-sm leading-6 text-white/70">A calmer way to plan, receive, send, and spend money across currencies.</p><div className="mt-8 grid max-w-md grid-cols-2 gap-3 text-[10px] text-white/75"><span className="rounded-xl border border-white/10 bg-white/10 p-3">Live exchange context</span><span className="rounded-xl border border-white/10 bg-white/10 p-3">Smarter travel budgets</span><span className="rounded-xl border border-white/10 bg-white/10 p-3">Clear payment choices</span><span className="rounded-xl border border-white/10 bg-white/10 p-3">Personal rate alerts</span></div></div><p className="text-[9px] text-white/45">© 2026 PesaRate. All rights reserved.</p></section>
    <section className="auth-panel flex min-h-170 items-center justify-center p-5 sm:p-10"><div className="w-full max-w-100"><div className="mb-7 flex items-center gap-2 lg:hidden"><img src={logo} alt="PesaRate" className="h-9 w-9 rounded-lg"/><b className="text-lg text-slate-900">Pesa<span className="text-[#43b34d]">Rate</span></b></div>{onboarding ? <div className="auth-reveal"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#43b34d]">One last step</p><h1 className="mt-3 text-2xl font-extrabold text-slate-900">What brings you to PesaRate?</h1><p className="mt-2 text-xs leading-5 text-slate-500">Choose all that apply. You can change these later from your Profile.</p><div className="mt-6 space-y-2">{USE_CASES.map((item) => <button type="button" key={item.id} onClick={() => toggleUseCase(item.id)} aria-pressed={useCases.includes(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${useCases.includes(item.id) ? "border-[#55c94b] bg-[#f1faef]" : "border-slate-200 bg-white hover:border-slate-300"}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${useCases.includes(item.id) ? "border-[#55c94b] bg-[#55c94b] text-white" : "border-slate-300 text-transparent"}`}><Check size={12}/></span><span><b className="block text-xs text-slate-800">{item.label}</b><small className="mt-0.5 block text-[10px] text-slate-400">{item.detail}</small></span></button>)}</div>{error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">{error}</p>}<button disabled={busy || !useCases.length} onClick={finishOnboarding} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 disabled:opacity-50">{busy ? "Saving..." : "Continue to PesaRate"}<ArrowRight size={14}/></button><button type="button" disabled={busy} onClick={() => nav("/dashboard", { replace: true })} className="mt-3 w-full py-2 text-[10px] font-semibold text-slate-400">Skip for now</button></div> : <><div className="text-center"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#43b34d]">Welcome to a clearer money life</p><h1 className="mt-3 text-2xl font-extrabold text-slate-900">{tab === "login" ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-xs text-slate-400">{tab === "login" ? "Sign in to continue to your account." : "Start making better currency decisions."}</p></div><div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button onClick={() => switchTab("login")} className={`rounded-lg py-2.5 text-xs font-bold transition ${tab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Login</button><button onClick={() => switchTab("signup")} className={`rounded-lg py-2.5 text-xs font-bold transition ${tab === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Sign up</button></div><form onSubmit={submit} className="mt-6 space-y-4">{tab === "signup" && <label className="block"><span className="text-[10px] font-semibold text-slate-500">Full name</span><div className="auth-input mt-1 flex items-center rounded-xl px-3"><UserRound size={15} className="text-slate-400"/><input required value={name} onChange={(event) => setName(event.target.value)} className="w-full bg-transparent p-3 text-xs outline-none" placeholder="Your name" autoComplete="name"/></div></label>}<label className="block"><span className="text-[10px] font-semibold text-slate-500">Email address</span><div className="auth-input mt-1 flex items-center rounded-xl px-3"><Mail size={15} className="text-slate-400"/><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent p-3 text-xs outline-none" placeholder="you@example.com" autoComplete="email"/></div></label><label className="block"><span className="text-[10px] font-semibold text-slate-500">Password</span><div className="auth-input mt-1 flex items-center rounded-xl px-3"><LockKeyhole size={15} className="text-slate-400"/><input required minLength={8} type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent p-3 text-xs outline-none" placeholder="At least 8 characters" autoComplete={tab === "login" ? "current-password" : "new-password"}/><button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="p-1 text-slate-400">{show ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></label>{tab === "login" && <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-[10px] text-slate-500"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#55c94b]"/> Remember me</label><button type="button" onClick={() => setNotice("Password reset is not available yet. Please contact support for help accessing your account.")} className="text-[10px] font-semibold text-[#3fb84a]">Forgot password?</button></div>}{notice && <p role="status" className="rounded-lg border border-[#cbeac7] bg-[#f1faef] p-3 text-xs text-[#31853a]">{notice}</p>}{error && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">{error}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#43b34d] disabled:opacity-60">{busy ? (tab === "login" ? "Signing in..." : "Creating account...") : (tab === "login" ? "Sign in" : "Create account")}<ArrowRight size={14}/></button></form><p className="mt-6 text-center text-[10px] text-slate-400">{tab === "login" ? <>Don't have an account? <button onClick={() => switchTab("signup")} className="font-bold text-[#3fb84a]">Sign up</button></> : <>Already have an account? <button onClick={() => switchTab("login")} className="font-bold text-[#3fb84a]">Login</button></>}</p><p className="mt-8 text-center text-[9px] text-slate-300">By continuing, you agree to PesaRate's terms and privacy policy.</p></>}</div></section>
  </div></div></main>;
}
