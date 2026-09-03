import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Globe2,
  LineChart,
  Plane,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import pesarateLogo from "../assets/pesarate-logo.png";

const CHANNELS = [
  { name: "Wise", cost: "0.80%", amount: "386.34 USD" },
  { name: "Remitly", cost: "1.20%", amount: "384.82 USD" },
  { name: "Bank", cost: "1.50%", amount: "383.70 USD" },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Live FX Intelligence",
    description:
      "See live KES exchange rates and understand the market before you move.",
    position: "orbit-card-1",
  },
  {
    icon: WalletCards,
    title: "Compare Channels",
    description:
      "Compare simulated provider costs and see which channel gives you the best value.",
    position: "orbit-card-2",
  },
  {
    icon: Plane,
    title: "Travel Planning",
    description:
      "Build smarter travel budgets with currencies, exchange channels and spending categories.",
    position: "orbit-card-3",
  },
  {
    icon: Bell,
    title: "Rate Alerts",
    description:
      "Set your target rate and stay informed when the market reaches your number.",
    position: "orbit-card-4",
  },
  {
    icon: LineChart,
    title: "Market Trends",
    description:
      "Track currency movements and financial signals without drowning in numbers.",
    position: "orbit-card-5",
  },
  {
    icon: Globe2,
    title: "Global Money",
    description:
      "Designed for people sending, receiving and planning money across borders.",
    position: "orbit-card-6",
  },
];

function MarketVisual() {
  return (
    <div className="relative mx-auto w-full max-w-130">
      <div className="absolute -inset-8 rounded-full bg-[#55c94b]/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#102a4a] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
              Market snapshot
            </p>
            <p className="mt-1 text-sm text-white/70">
              Live KES exchange intelligence
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#55c94b]/20 bg-[#55c94b]/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#55c94b]" />
            <span className="text-xs font-semibold text-[#55c94b]">
              LIVE
            </span>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm text-white/45">USD / KES</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">
              129.42
            </p>
          </div>

          <div className="rounded-2xl bg-[#55c94b]/10 px-4 py-3 text-right">
            <p className="text-xs text-white/45">24h movement</p>
            <p className="mt-1 text-sm font-bold text-[#55c94b]">+1.8%</p>
          </div>
        </div>

        <div className="relative h-36 overflow-hidden rounded-2xl border border-white/5 bg-[#031933] p-4">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/5" />
          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/5" />
          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/5" />

          <svg
            viewBox="0 0 500 120"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 91 C35 88 45 80 70 84 C95 88 108 72 130 75 C153 78 170 58 195 64 C220 70 231 50 253 55 C278 61 289 41 310 47 C333 53 350 35 374 39 C400 43 414 25 435 31 C457 36 478 20 500 24"
              fill="none"
              stroke="#55c94b"
              strokeWidth="3"
            />
          </svg>

          <div className="absolute bottom-3 left-4 text-[10px] text-white/25">
            09:00
          </div>

          <div className="absolute bottom-3 right-4 text-[10px] text-white/25">
            NOW
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <p className="text-[10px] uppercase tracking-widest text-white/35">
              USD
            </p>
            <p className="mt-1 font-semibold text-white">129.42</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <p className="text-[10px] uppercase tracking-widest text-white/35">
              GBP
            </p>
            <p className="mt-1 font-semibold text-white">174.08</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <p className="text-[10px] uppercase tracking-widest text-white/35">
              EUR
            </p>
            <p className="mt-1 font-semibold text-white">151.22</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderComparison() {
  return (
    <div className="absolute -right-4 bottom-8 z-20 hidden w-64 rounded-3xl border border-white/10 bg-white p-5 shadow-2xl md:block">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#031933]/40">
            Compare channels
          </p>
          <p className="mt-1 text-sm font-bold text-[#031933]">
            Best value
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#55c94b]/15">
          <Check size={15} className="text-[#55c94b]" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {CHANNELS.map((channel, index) => (
          <div
            key={channel.name}
            className={`flex items-center justify-between rounded-2xl px-3 py-2.5 ${
              index === 0
                ? "bg-[#55c94b]/10"
                : "bg-[#f6f8fb]"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-[#031933]">
                {channel.name}
              </p>
              <p className="text-[10px] text-[#031933]/40">
                {channel.cost}
              </p>
            </div>

            <p className="text-xs font-bold text-[#031933]">
              {channel.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrbitCard({ feature }) {
  const Icon = feature.icon;

  return (
    <div
      className={`absolute ${feature.position} w-56 rounded-3xl border border-[#031933]/8 bg-white p-5 shadow-xl`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#55c94b]/12">
        <Icon size={19} className="text-[#55c94b]" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#031933]">
        {feature.title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#031933]/55">
        {feature.description}
      </p>
    </div>
  );
}

function FloatingFeatureSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6f8fb] py-28">
      <style>{`
        @keyframes orbit-one {
          0%, 100% {
            transform: translate3d(0, -8px, 0) rotate(-1deg);
          }
          50% {
            transform: translate3d(12px, 12px, 0) rotate(1deg);
          }
        }

        @keyframes orbit-two {
          0%, 100% {
            transform: translate3d(8px, 8px, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(-12px, -10px, 0) rotate(-1deg);
          }
        }

        @keyframes orbit-three {
          0%, 100% {
            transform: translate3d(-8px, 4px, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(10px, -12px, 0) rotate(-1deg);
          }
        }

        @keyframes orbit-four {
          0%, 100% {
            transform: translate3d(0, 10px, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(-10px, -10px, 0) rotate(-1deg);
          }
        }

        @keyframes orbit-five {
          0%, 100% {
            transform: translate3d(-10px, -5px, 0) rotate(-1deg);
          }
          50% {
            transform: translate3d(12px, 10px, 0) rotate(1deg);
          }
        }

        @keyframes orbit-six {
          0%, 100% {
            transform: translate3d(10px, 5px, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(-12px, -10px, 0) rotate(-1deg);
          }
        }

        .orbit-card-1 {
          left: 4%;
          top: 8%;
          animation: orbit-one 6s ease-in-out infinite;
        }

        .orbit-card-2 {
          right: 4%;
          top: 8%;
          animation: orbit-two 7s ease-in-out infinite;
        }

        .orbit-card-3 {
          left: 0;
          top: 48%;
          animation: orbit-three 6.5s ease-in-out infinite;
        }

        .orbit-card-4 {
          right: 0;
          top: 48%;
          animation: orbit-four 7.5s ease-in-out infinite;
        }

        .orbit-card-5 {
          left: 8%;
          bottom: 3%;
          animation: orbit-five 6.8s ease-in-out infinite;
        }

        .orbit-card-6 {
          right: 8%;
          bottom: 3%;
          animation: orbit-six 7.2s ease-in-out infinite;
        }

        @media (max-width: 1023px) {
          .orbit-card-1,
          .orbit-card-2,
          .orbit-card-3,
          .orbit-card-4,
          .orbit-card-5,
          .orbit-card-6 {
            position: relative;
            inset: auto;
            width: 100%;
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-card-1,
          .orbit-card-2,
          .orbit-card-3,
          .orbit-card-4,
          .orbit-card-5,
          .orbit-card-6 {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-295 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#55c94b]">
            PesaRate intelligence
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#031933] md:text-5xl">
            Built around the decisions
            <span className="block text-[#55c94b]">
              behind your money.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#031933]/55">
            PesaRate brings rates, channels, trends, alerts and travel
            planning together in one intelligent financial workspace.
          </p>
        </div>

        <div className="relative mx-auto mt-20 hidden h-155 max-w-270 lg:block">
          <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#55c94b]/10" />

          <div className="absolute left-1/2 top-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#031933]/5" />

          <div className="absolute left-1/2 top-1/2 h-65 w-65 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#55c94b]/15" />

          <div className="absolute left-1/2 top-1/2 z-10 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#031933]/8 bg-white shadow-2xl">
            <div className="absolute inset-3 rounded-full bg-[#031933]" />

            <img
              src={pesarateLogo}
              alt="PesaRate"
              className="relative z-10 h-24 w-24 object-contain"
            />
          </div>

          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#55c94b] shadow-[0_0_30px_8px_rgba(85,201,75,0.25)]" />

          {FEATURES.map((feature) => (
            <OrbitCard key={feature.title} feature={feature} />
          ))}
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:hidden">
          {FEATURES.map((feature) => (
            <OrbitCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#031933]">
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-17 max-w-295 items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={pesarateLogo}
              alt="PesaRate"
              className="h-10 w-10 object-contain"
            />

            <span className="text-lg font-bold tracking-tight text-white">
              PesaRate
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-white/65 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#intelligence"
              className="text-sm font-medium text-white/65 transition hover:text-white"
            >
              Intelligence
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-white transition hover:text-[#55c94b]"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="rounded-full bg-[#55c94b] px-5 py-2.5 text-sm font-bold text-[#031933] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get started
            </Link>
          </nav>

          <Link
            to="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white md:hidden"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen overflow-hidden bg-[#031933]">
          <div className="absolute -right-45 -top-45 h-112.5 w-112.5 rounded-full bg-[#55c94b]/10 blur-3xl" />

          <div className="absolute -bottom-55 -left-45 h-125 w-125 rounded-full bg-[#102a4a] blur-3xl" />

          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4" />
            <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4" />
          </div>

          <div className="relative mx-auto grid min-h-screen max-w-295 items-center gap-16 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#55c94b]/20 bg-[#55c94b]/8 px-4 py-2">
                <Sparkles size={14} className="text-[#55c94b]" />
                <span className="text-xs font-semibold tracking-wide text-white/75">
                  Financial intelligence for real life
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Your money.
                <span className="block text-[#55c94b]">
                  In context.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/55">
                Know the rate. Compare the cost. Plan the trip. Make the move
                with more confidence.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#55c94b] px-6 py-3.5 text-sm font-bold text-[#031933] transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start using PesaRate
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore your workspace
                  <ChevronRight size={17} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#55c94b]" />
                  Live market rates
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#55c94b]" />
                  Channel comparison
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#55c94b]" />
                  Smart trip planning
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-130">
              <MarketVisual />
              <ProviderComparison />
            </div>
          </div>
        </section>

        <section className="border-b border-[#031933]/5 bg-white">
          <div className="mx-auto grid max-w-295 divide-y divide-[#031933]/5 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            <div className="px-5 py-3 text-center sm:text-left">
              <p className="text-2xl font-bold text-[#031933]">129.42</p>
              <p className="mt-1 text-xs text-[#031933]/45">
                Live USD / KES reference
              </p>
            </div>

            <div className="px-5 py-3 text-center sm:text-left">
              <p className="text-2xl font-bold text-[#031933]">5</p>
              <p className="mt-1 text-xs text-[#031933]/45">
                Exchange channels compared
              </p>
            </div>

            <div className="px-5 py-3 text-center sm:text-left">
              <p className="text-2xl font-bold text-[#031933]">6</p>
              <p className="mt-1 text-xs text-[#031933]/45">
                Travel budget categories
              </p>
            </div>
          </div>
        </section>

        <div id="features">
          <FloatingFeatureSection />
        </div>

        <section
          id="intelligence"
          className="relative overflow-hidden bg-[#031933] py-28"
        >
          <div className="absolute right-0 top-0 h-100 w-100 rounded-full bg-[#55c94b]/10 blur-3xl" />

          <div className="relative mx-auto max-w-295 px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#55c94b]">
                  One financial workspace
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Stop checking five places before making one decision.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-white/50">
                  PesaRate brings the information together so you can
                  understand what is happening, compare your options and
                  decide what makes sense.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Understand the live market rate",
                    "Compare simulated provider costs",
                    "Track trends and set target-rate alerts",
                    "Build travel budgets around real exchange decisions",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/70"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#55c94b]/12">
                        <Check size={13} className="text-[#55c94b]" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#102a4a] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/35">
                      Decision snapshot
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      KES → USD
                    </p>
                  </div>

                  <div className="rounded-full bg-[#55c94b]/10 px-3 py-1.5 text-xs font-bold text-[#55c94b]">
                    LIVE
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-[#031933] p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/35">
                        You send
                      </p>
                      <p className="mt-1 text-3xl font-bold text-white">
                        50,000 KES
                      </p>
                    </div>

                    <ArrowRight className="text-[#55c94b]" size={20} />

                    <div className="text-right">
                      <p className="text-xs text-white/35">
                        Recipient gets
                      </p>
                      <p className="mt-1 text-3xl font-bold text-white">
                        386.34 USD
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/35">
                        Best channel
                      </span>
                      <span className="font-bold text-[#55c94b]">
                        Wise · Lowest cost
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-white/35">
                        Mid-market rate
                      </span>
                      <span className="font-semibold text-white">
                        1 USD = 129.42 KES
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/4 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">
                      USD
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      129.42
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/4 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">
                      GBP
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      174.08
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/4 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">
                      EUR
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      151.22
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f8fb] py-24">
          <div className="mx-auto max-w-295 px-6 text-center lg:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#55c94b]">
              Make the next move
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#031933] md:text-5xl">
              Money decisions deserve more than a single exchange-rate box.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#031933]/50">
              Explore PesaRate and turn scattered financial information into
              one clear decision.
            </p>

            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#031933] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#102a4a]"
            >
              Create your PesaRate account
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#031933]">
        <div className="mx-auto flex max-w-295 flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={pesarateLogo}
              alt="PesaRate"
              className="h-9 w-9 object-contain"
            />

            <div>
              <p className="text-sm font-bold text-white">PesaRate</p>
              <p className="text-xs text-white/35">
                Move smarter. Know more.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-white/35">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>

            <a
              href="#intelligence"
              className="transition hover:text-white"
            >
              Intelligence
            </a>

            <Link to="/login" className="transition hover:text-white">
              Sign in
            </Link>

            <Link to="/signup" className="transition hover:text-white">
              Get started
            </Link>
          </div>

          <p className="text-xs text-white/25">
            © 2026 PesaRate
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;