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
  Plane,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/pesarate-logo.png";
import { PURPOSE_OPTIONS } from "../utils/personalization";

const USE_CASES = PURPOSE_OPTIONS;

const providerData = [
  { name: "Wise", fee: "0.80%", amount: "KES 98,420", best: true },
  { name: "M-Pesa", fee: "1.00%", amount: "KES 98,210" },
  { name: "Remitly", fee: "1.20%", amount: "KES 98,030" },
];

const budgetData = [
  { label: "Stay", value: 38 },
  { label: "Food", value: 24 },
  { label: "Transport", value: 16 },
  { label: "Fun", value: 22 },
];

function MarketVisual() {
  return (
    <div className="relative w-full max-w-135">
      {/* glow */}
      <div className="absolute -inset-8 rounded-[50px] bg-[#55c94b]/10 blur-3xl" />

      {/* main dashboard card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#55c94b]/5" />

        <div className="relative">
          {/* card header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">
                Live conversion
              </p>
              <p className="mt-1 text-xs text-white/70">
                Updated just now
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#55c94b]/15 text-[#8ee88a]">
              <TrendingUp size={15} />
            </div>
          </div>

          {/* conversion */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#031933]/55 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/35">
                  You send
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  KES 100,000
                </p>
              </div>

              <ArrowLeftRight size={18} className="text-[#55c94b]" />

              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-white/35">
                  Recipient gets
                </p>
                <p className="mt-1 text-2xl font-bold text-[#9eea9a]">
                  $768.42
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[10px] text-white/45">
                Mid-market rate
              </span>
              <span className="text-[10px] font-bold text-white/75">
                1 USD = 130.14 KES
              </span>
            </div>
          </div>

          {/* provider comparison */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#031933]/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/75">
                Compare channels
              </span>
              <span className="rounded-full bg-[#55c94b]/10 px-2 py-1 text-[8px] font-bold text-[#8ee88a]">
                SMART PICK
              </span>
            </div>

            <div className="space-y-2">
              {providerData.map((provider) => (
                <div
                  key={provider.name}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                    provider.best
                      ? "border-[#55c94b]/30 bg-[#55c94b]/8"
                      : "border-white/6 bg-white/3"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-6 w-6 place-items-center rounded-lg bg-white/8">
                      <WalletCards size={11} className="text-white/60" />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-white">
                        {provider.name}
                      </p>

                      {provider.best && (
                        <p className="text-[8px] font-semibold text-[#8ee88a]">
                          Lowest cost
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold text-white/75">
                      {provider.amount}
                    </p>
                    <p className="text-[8px] text-white/35">
                      {provider.fee} cost
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* budget */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#031933]/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane size={12} className="text-[#8ee88a]" />
                <span className="text-[10px] font-bold text-white/75">
                  Nairobi → Paris
                </span>
              </div>

              <span className="text-[9px] text-white/35">
                12 days
              </span>
            </div>

            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/8">
              {budgetData.map((item) => (
                <div
                  key={item.label}
                  style={{ width: `${item.value}%` }}
                  className="h-full border-r border-[#031933]"
                />
              ))}
            </div>

            <div className="mt-3 flex justify-between">
              {budgetData.map((item) => (
                <span
                  key={item.label}
                  className="text-[8px] text-white/35"
                >
                  {item.label} {item.value}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating rate card */}
      <div className="absolute -right-5 -top-5 hidden w-44 rounded-2xl border border-white/10 bg-[#102a4a]/95 p-3 shadow-xl backdrop-blur-xl sm:block">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold text-white/45">
            USD / KES
          </span>
          <span className="text-[9px] font-bold text-[#8ee88a]">
            +2.4%
          </span>
        </div>

        <p className="mt-2 text-xl font-bold text-white">
          130.14
        </p>

        <div className="mt-2 flex items-end gap-1">
          {[18, 27, 22, 34, 30, 43, 38, 52, 47, 62, 57, 71].map(
            (height, index) => (
              <div
                key={index}
                style={{ height: `${height}px` }}
                className="flex-1 rounded-t-sm bg-[#55c94b]/60"
              />
            )
          )}
        </div>
      </div>

      {/* floating insight */}
      <div className="absolute -bottom-6 -left-5 hidden w-52 rounded-2xl border border-white/10 bg-[#102a4a]/95 p-3 shadow-xl backdrop-blur-xl sm:block">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#55c94b]/15 text-[#8ee88a]">
            <Sparkles size={12} />
          </div>

          <div>
            <p className="text-[9px] font-bold text-white">
              Smarter money decisions
            </p>
            <p className="mt-0.5 text-[8px] text-white/40">
              Compare before you convert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-[#dcefd9] bg-linear-to-br from-[#f5fcf3] via-white to-[#eef9ec] p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#55c94b]/10 text-[#43b34d]">
        <Sparkles size={21} />
      </div>

      <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-[#43b34d]">
        Account created
      </p>

      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        Welcome to PesaRate
      </h2>

      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
        Your smarter way to understand, compare, and plan around currency.
      </p>
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
    if (status === "signed-in" && !onboarding) {
      nav("/dashboard", { replace: true });
    }
  }, [status, onboarding, nav]);

  useEffect(() => {
    if (!onboarding || !showWelcome) return;

    const timer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 1800);

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

    nav(next === "login" ? "/login" : "/signup", {
      replace: true,
    });
  };

  const toggleUseCase = (id) => {
    setUseCases((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const nextNameError =
      tab === "signup" && !trimmedName
        ? "Please enter your name."
        : "";

    const nextEmailError = !trimmedEmail
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
        ? "Enter a valid email address."
        : "";

    const nextPasswordError = !password
      ? "Password is required."
      : password.length < 8
        ? "Use at least 8 characters."
        : "";

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    return (
      !nextNameError &&
      !nextEmailError &&
      !nextPasswordError
    );
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

      await register(
        email.trim(),
        password,
        name.trim(),
        remember
      );

      setOnboarding(true);
      setShowWelcome(true);
      setUseCases([]);
      setBusy(false);
    } catch (err) {
      setError(
        err.message || "Something went wrong on our end."
      );
      setBusy(false);
    }
  };

  const finishOnboarding = async () => {
    setBusy(true);
    setError("");

    try {
      await updateProfile({
        use_cases: useCases,
      });

      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message || "Something went wrong on our end."
      );
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* =====================================================
            LEFT — AUTH FORM
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-105">
            {/* logo */}
            <button
              type="button"
              onClick={() => nav("/")}
              className="mb-10 flex items-center gap-2"
            >
              <img
                src={logo}
                alt="PesaRate"
                className="h-9 w-9 rounded-xl"
              />

              <span className="text-lg font-extrabold tracking-tight">
                Pesa<span className="text-[#55c94b]">Rate</span>
              </span>
            </button>

            {onboarding ? (
              <div>
                {showWelcome ? (
                  <WelcomeCard />
                ) : (
                  <>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#43b34d]">
                        Personalize your experience
                      </p>

                      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                        What brings you to PesaRate?
                      </h1>

                      <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">
                        Choose everything that applies. You can
                        change these preferences later from your
                        Profile.
                      </p>
                    </div>

                    <div className="mt-7 space-y-2.5">
                      {USE_CASES.map((item) => {
                        const selected = useCases.includes(item.id);

                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() =>
                              toggleUseCase(item.id)
                            }
                            aria-pressed={selected}
                            className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                              selected
                                ? "border-[#55c94b] bg-[#f1faef]"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border ${
                                selected
                                  ? "border-[#55c94b] bg-[#55c94b] text-white"
                                  : "border-slate-300 text-transparent"
                              }`}
                            >
                              <Check size={13} />
                            </span>

                            <span>
                              <b className="block text-xs font-bold text-slate-800">
                                {item.icon} {item.label}
                              </b>

                              <small className="mt-1 block text-[10px] leading-4 text-slate-400">
                                {item.detail}
                              </small>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      disabled={busy || !useCases.length}
                      onClick={finishOnboarding}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3.5 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#43b34d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy
                        ? "Saving..."
                        : "Continue to PesaRate"}

                      <ArrowRight size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        nav("/dashboard", {
                          replace: true,
                        })
                      }
                      className="mt-3 w-full py-2 text-[10px] font-semibold text-slate-400 transition hover:text-slate-600"
                    >
                      Skip for now
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* heading */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#43b34d]">
                    Your money. Your decisions.
                  </p>

                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                    {tab === "login"
                      ? "Welcome back."
                      : "Start your smarter money journey."}
                  </h1>

                  <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">
                    {tab === "login"
                      ? "Sign in to continue managing your currencies, conversions, and travel plans."
                      : "Create your free account and bring your currency decisions into one place."}
                  </p>
                </div>

                {/* tabs */}
                <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className={`rounded-lg py-2.5 text-xs font-bold transition ${
                      tab === "login"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Sign in
                  </button>

                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className={`rounded-lg py-2.5 text-xs font-bold transition ${
                      tab === "signup"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {/* form */}
                <form
                  onSubmit={submit}
                  className="mt-7 space-y-4"
                >
                  {tab === "signup" && (
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-600">
                        Full name
                      </span>

                      <div
                        className={`mt-1.5 flex items-center rounded-xl border bg-white px-3 transition focus-within:border-[#55c94b] focus-within:ring-3 focus-within:ring-[#55c94b]/10 ${
                          nameError
                            ? "border-red-300"
                            : "border-slate-200"
                        }`}
                      >
                        <UserRound
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <input
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value);

                            if (nameError) {
                              setNameError("");
                            }
                          }}
                          className="w-full bg-transparent p-3 text-xs outline-none"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={Boolean(nameError)}
                        />
                      </div>

                      {nameError && (
                        <p className="mt-1 text-[10px] text-red-600">
                          {nameError}
                        </p>
                      )}
                    </label>
                  )}

                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-600">
                      Email address
                    </span>

                    <div
                      className={`mt-1.5 flex items-center rounded-xl border bg-white px-3 transition focus-within:border-[#55c94b] focus-within:ring-3 focus-within:ring-[#55c94b]/10 ${
                        emailError
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                    >
                      <Mail
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);

                          if (emailError) {
                            setEmailError("");
                          }
                        }}
                        className="w-full bg-transparent p-3 text-xs outline-none"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                      />
                    </div>

                    {emailError && (
                      <p className="mt-1 text-[10px] text-red-600">
                        {emailError}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-600">
                      Password
                    </span>

                    <div
                      className={`mt-1.5 flex items-center rounded-xl border bg-white px-3 transition focus-within:border-[#55c94b] focus-within:ring-3 focus-within:ring-[#55c94b]/10 ${
                        passwordError
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                    >
                      <LockKeyhole
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <input
                        minLength={8}
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);

                          if (passwordError) {
                            setPasswordError("");
                          }
                        }}
                        className="w-full bg-transparent p-3 text-xs outline-none"
                        placeholder="At least 8 characters"
                        autoComplete={
                          tab === "login"
                            ? "current-password"
                            : "new-password"
                        }
                        aria-invalid={Boolean(passwordError)}
                      />

                      <button
                        type="button"
                        aria-label={
                          show
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShow((current) => !current)
                        }
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >
                        {show ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>

                    {passwordError && (
                      <p className="mt-1 text-[10px] text-red-600">
                        {passwordError}
                      </p>
                    )}
                  </label>

                  {tab === "login" && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex cursor-pointer items-center gap-2 text-[10px] text-slate-500">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(event) =>
                            setRemember(event.target.checked)
                          }
                          className="h-3.5 w-3.5 accent-[#55c94b]"
                        />

                        Remember me
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setNotice(
                            "Password reset is not available yet. Please contact support for help accessing your account."
                          )
                        }
                        className="text-[10px] font-bold text-[#3fb84a] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {notice && (
                    <p
                      role="status"
                      className="rounded-xl border border-[#cbeac7] bg-[#f1faef] p-3 text-xs leading-5 text-[#31853a]"
                    >
                      {notice}
                    </p>
                  )}

                  {error && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    disabled={busy}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#55c94b] py-3.5 text-xs font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#43b34d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy
                      ? tab === "login"
                        ? "Signing in..."
                        : "Creating account..."
                      : tab === "login"
                        ? "Sign in"
                        : "Create account"}

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </form>

                {/* switch */}
                <p className="mt-6 text-center text-[10px] text-slate-400">
                  {tab === "login" ? (
                    <>
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchTab("signup")}
                        className="font-bold text-[#3fb84a] hover:underline"
                      >
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchTab("login")}
                        className="font-bold text-[#3fb84a] hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>

                {/* trust */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[9px] text-slate-300">
                  <Landmark size={11} />
                  <span>
                    Your currency workspace, all in one place.
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* =====================================================
            RIGHT — PRODUCT STORY
        ====================================================== */}
        <aside className="relative hidden min-h-screen overflow-hidden bg-[#031933] lg:block">
          {/* background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(85,201,75,0.16),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(117,212,255,0.08),transparent_30%)]" />

          <div className="absolute -right-40 -top-40 h-112.5 w-112.5 rounded-full border border-white/4" />
          <div className="absolute -bottom-45 -left-45 h-125 w-125 rounded-full border border-white/4" />

          <div className="relative flex min-h-screen flex-col justify-between px-10 py-10 xl:px-16">
            {/* brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="PesaRate"
                  className="h-9 w-9 rounded-xl"
                />

                <span className="text-lg font-extrabold text-white">
                  Pesa<span className="text-[#55c94b]">
                    Rate
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#55c94b]" />
                <span className="text-[8px] font-semibold uppercase tracking-widest text-white/45">
                  Live market
                </span>
              </div>
            </div>

            {/* story */}
            <div className="mx-auto flex w-full max-w-140 flex-col items-center">
              <div className="mb-10 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8ee88a]">
                  Currency intelligence, simplified
                </p>

                <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-5xl">
                  Know what your money is
                  <span className="text-[#55c94b]">
                    {" "}really worth.
                  </span>
                </h2>

                <p className="mx-auto mt-5 max-w-md text-xs leading-6 text-white/50">
                  Track live rates, compare exchange channels,
                  and plan your travel money before you make
                  the move.
                </p>
              </div>

              <MarketVisual />
            </div>

            {/* footer */}
            <div className="flex items-center justify-between text-[9px] text-white/30">
              <span>
                © 2026 PesaRate. All rights reserved.
              </span>

              <span className="flex items-center gap-1.5">
                <Sparkles size={10} />
                Built for smarter decisions
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
