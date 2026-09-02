import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Landmark,
  LockKeyhole,
  Mail,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/pesarate-logo.png";
import { PURPOSE_OPTIONS } from "../utils/personalization";
import "../styles/auth.css";

const USE_CASES = PURPOSE_OPTIONS;
const CONFETTI_COLORS = ["#55c94b", "#e2bb5b", "#75d4ff", "#8f7af7", "#ff8a6d"];

function ConfettiBurst() {
  return (
    <div className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 7) % 100}%`,
            animationDelay: `${(index % 7) * 0.08}s`,
            background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
          }}
        />
      ))}
    </div>
  );
}

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [useCases, setUseCases] = useState([]);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (status === "signed-in" && !onboarding) nav("/dashboard", { replace: true });
  }, [status, onboarding, nav]);

  useEffect(() => {
    if (!onboarding || !showWelcome) return;
    const timer = window.setTimeout(() => setShowWelcome(false), 1800);
    return () => window.clearTimeout(timer);
  }, [onboarding, showWelcome]);

  const switchTab = (next) => {
    setTab(next);
    setError("");
    setNotice("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setShowWelcome(false);
    nav(next === "login" ? "/login" : "/signup", { replace: true });
  };

  const toggleUseCase = (id) =>
    setUseCases((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nextNameError = tab === "signup" && !trimmedName ? "Please enter your name." : "";
    const nextEmailError = !trimmedEmail
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
        ? "Enter a valid email address."
        : "";
    const nextPasswordError = !password ? "Password is required." : password.length < 8 ? "Use at least 8 characters." : "";

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    return !nextNameError && !nextEmailError && !nextPasswordError;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!validate()) return;
    setBusy(true);

    try {
      if (tab === "login") {
        await login(email.trim(), password, remember);
        nav("/dashboard", { replace: true });
        return;
      }

      await register(email.trim(), password, name.trim(), remember);
      setOnboarding(true);
      setShowWelcome(true);
      setUseCases([]);
      setBusy(false);
    } catch (err) {
      setError(err.message || "Something went wrong on our end.");
      setBusy(false);
    }
  };

  const finishOnboarding = async () => {
    setBusy(true);
    setError("");
    try {
      await updateProfile({ use_cases: useCases });
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong on our end.");
      setBusy(false);
    }
  };

  return (
    <main className="auth-bg min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-330 items-center justify-center">
        <div className="auth-frame grid w-full overflow-hidden rounded-[30px] border border-white/15 shadow-[0_30px_80px_rgba(15,23,42,0.28)] lg:grid-cols-[1.05fr_.95fr]">
          <section className="auth-story relative hidden min-h-170 flex-col justify-between p-10 text-white lg:flex">
            <div className="flex items-center gap-2">
              <img src={logo} alt="PesaRate" className="h-9 w-9 rounded-lg" />
              <b className="text-xl">Pesa<span className="text-[#55c94b]">Rate</span></b>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/4 p-5 backdrop-blur-md">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(85,201,75,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(117,212,255,0.2),transparent_40%)]" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-[10px] text-white/80">
                  <span className="flex items-center gap-2"><WalletCards size={14} className="text-[#9fe7a1]" /> USD → KES</span>
                  <span className="font-bold text-[#aaf0ae]">+2.4%</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] text-white/80">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="flex items-center gap-2 text-white/65"><Landmark size={12} /> FX signal</div>
                    <p className="mt-3 text-xl font-bold text-white">1.26</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3">
                    <div className="flex items-center gap-2 text-white/65"><TrendingUp size={12} /> Weekly</div>
                    <p className="mt-3 text-xl font-bold text-white">+4.8%</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3">
                  <div className="flex items-center justify-between text-[10px] text-white/70">
                    <span>Travel budget</span>
                    <span>KES 210,000</span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[72%] rounded-full bg-linear-to-r from-[#7fe17d] to-[#43b34d]" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-[10px] text-white/72">
                  <span>Send</span>
                  <span className="flex items-center gap-2"><ArrowLeftRight size={12} className="text-[#aaf0ae]" /> GBP → EUR</span>
                </div>
              </div>
            </div>

            <div className="max-w-lg">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#a9df9f]">Your money. Your currencies. Your decisions.</p>
              <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight">See the value behind every rate.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">A calmer way to plan, send, receive, and spend internationally with confidence.</p>
            </div>

            <p className="text-[9px] text-white/45">© 2026 PesaRate. All rights reserved.</p>
          </section>

          <section className="auth-panel flex min-h-170 items-center justify-center p-5 sm:p-10">
            <div className="w-full max-w-100">
              <div className="mb-7 flex items-center gap-2 lg:hidden">
                <img src={logo} alt="PesaRate" className="h-9 w-9 rounded-lg" />
                <b className="text-lg text-slate-900">Pesa<span className="text-[#43b34d]">Rate</span></b>
              </div>

              {onboarding ? (
                <div className="auth-reveal">
                  {showWelcome && (
                    <div className="relative mb-5 overflow-hidden rounded-3xl border border-[#dfeee0] bg-linear-to-r from-[#f6fbf5] via-[#ffffff] to-[#f2fbf0] p-4 text-center shadow-sm">
                      <ConfettiBurst />
                      <div className="relative">
                        <div className="mb-2 flex justify-center text-[#55c94b]"><Sparkles size={18} /></div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#43b34d]">Welcome</p>
                        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Welcome to PesaRate</h2>
                      </div>
                    </div>
                  )}

                  {!showWelcome && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#43b34d]">One last step</p>
                      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">What brings you to PesaRate?</h1>
                      <p className="mt-2 text-xs leading-5 text-slate-500">Choose all that apply. You can change these later from your Profile.</p>

                      <div className="mt-6 space-y-2">
                        {USE_CASES.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleUseCase(item.id)}
                            aria-pressed={useCases.includes(item.id)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${useCases.includes(item.id) ? "border-[#55c94b] bg-[#f1faef]" : "border-slate-200 bg-white hover:border-slate-300"}`}
                          >
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${useCases.includes(item.id) ? "border-[#55c94b] bg-[#55c94b] text-white" : "border-slate-300 text-transparent"}`}>
                              <Check size={12} />
                            </span>
                            <span>
                              <b className="block text-xs text-slate-800">{item.icon} {item.label}</b>
                              <small className="mt-0.5 block text-[10px] text-slate-400">{item.detail}</small>
                            </span>
                          </button>
                        ))}
                      </div>

                      {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">{error}</p>}

                      <button
                        disabled={busy || !useCases.length}
                        onClick={finishOnboarding}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#43b34d] disabled:opacity-60"
                      >
                        {busy ? "Saving..." : "Continue to PesaRate"}
                        <ArrowRight size={14} />
                      </button>

                      <button type="button" disabled={busy} onClick={() => nav("/dashboard", { replace: true })} className="mt-3 w-full py-2 text-[10px] font-semibold text-slate-400">Skip for now</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#43b34d]">Welcome to a clearer money life</p>
                    <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{tab === "login" ? "Welcome back" : "Create your account"}</h1>
                    <p className="mt-2 text-xs text-slate-400">{tab === "login" ? "Sign in to continue to your account." : "Start making smarter currency decisions."}</p>
                  </div>

                  <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                    <button onClick={() => switchTab("login")} className={`rounded-lg py-2.5 text-xs font-bold transition ${tab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Login</button>
                    <button onClick={() => switchTab("signup")} className={`rounded-lg py-2.5 text-xs font-bold transition ${tab === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Sign up</button>
                  </div>

                  <form onSubmit={submit} className="mt-6 space-y-4">
                    {tab === "signup" && (
                      <label className="block">
                        <span className="text-[10px] font-semibold text-slate-500">Full name</span>
                        <div className={`auth-input mt-1 flex items-center rounded-xl px-3 ${nameError ? "input-error" : ""}`}>
                          <UserRound size={15} className="text-slate-400" />
                          <input
                            value={name}
                            onChange={(event) => {
                              setName(event.target.value);
                              if (nameError) setNameError("");
                            }}
                            className="w-full bg-transparent p-3 text-xs outline-none"
                            placeholder="Your name"
                            autoComplete="name"
                            aria-invalid={Boolean(nameError)}
                          />
                        </div>
                        {nameError && <p className="mt-1 text-[10px] text-red-600">{nameError}</p>}
                      </label>
                    )}

                    <label className="block">
                      <span className="text-[10px] font-semibold text-slate-500">Email address</span>
                      <div className={`auth-input mt-1 flex items-center rounded-xl px-3 ${emailError ? "input-error" : ""}`}>
                        <Mail size={15} className="text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            if (emailError) setEmailError("");
                          }}
                          className="w-full bg-transparent p-3 text-xs outline-none"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={Boolean(emailError)}
                        />
                      </div>
                      {emailError && <p className="mt-1 text-[10px] text-red-600">{emailError}</p>}
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-semibold text-slate-500">Password</span>
                      <div className={`auth-input mt-1 flex items-center rounded-xl px-3 ${passwordError ? "input-error" : ""}`}>
                        <LockKeyhole size={15} className="text-slate-400" />
                        <input
                          minLength={8}
                          type={show ? "text" : "password"}
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                          className="w-full bg-transparent p-3 text-xs outline-none"
                          placeholder="At least 8 characters"
                          autoComplete={tab === "login" ? "current-password" : "new-password"}
                          aria-invalid={Boolean(passwordError)}
                        />
                        <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((current) => !current)} className="p-1 text-slate-400">
                          {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {passwordError && <p className="mt-1 text-[10px] text-red-600">{passwordError}</p>}
                    </label>

                    {tab === "login" && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-[10px] text-slate-500">
                          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#55c94b]" />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() => setNotice("Password reset is not available yet. Please contact support for help accessing your account.")}
                          className="text-[10px] font-semibold text-[#3fb84a]"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {notice && <p role="status" className="rounded-lg border border-[#cbeac7] bg-[#f1faef] p-3 text-xs text-[#31853a]">{notice}</p>}
                    {error && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">{error}</p>}

                    <button
                      disabled={busy}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#43b34d] disabled:opacity-60"
                    >
                      {busy ? (tab === "login" ? "Signing in..." : "Creating account...") : (tab === "login" ? "Sign in" : "Create account")}
                      <ArrowRight size={14} />
                    </button>
                  </form>

                  <p className="mt-6 text-center text-[10px] text-slate-400">
                    {tab === "login" ? (
                      <>
                        Don’t have an account? <button onClick={() => switchTab("signup")} className="font-bold text-[#3fb84a]">Sign up</button>
                      </>
                    ) : (
                      <>
                        Already have an account? <button onClick={() => switchTab("login")} className="font-bold text-[#3fb84a]">Login</button>
                      </>
                    )}
                  </p>

                  <p className="mt-8 text-center text-[9px] text-slate-300">By continuing, you agree to PesaRate’s terms and privacy policy.</p>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
