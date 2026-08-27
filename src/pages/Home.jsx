import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, Plane, TrendingUp, Sparkles } from "lucide-react";
import RateTicker from "../components/RateTicker";
import heroBg from "../assets/pesarate-hero-bg.jpg";

const pillars = [
  [ArrowLeftRight, "Convert", "Get the number, then understand it."],
  [TrendingUp, "Understand", "See movements, trends and context."],
  [Plane, "Travel money", "Turn a trip budget into a real spending plan."],
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-paper">
      {/* Hero background image, faded into the ink bg on the left so our
          own headline stays legible over the currency-mockup / globe art. */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[position:70%_center] opacity-70"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ink) 0%, var(--color-ink) 30%, rgba(11,22,20,0.55) 55%, rgba(11,22,20,0.15) 75%, rgba(11,22,20,0.55) 100%), linear-gradient(0deg, var(--color-ink) 0%, transparent 22%, transparent 78%, var(--color-ink) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <RateTicker />
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="stamp grid h-10 w-10 place-items-center rounded-xl bg-lime font-[family-name:var(--font-display)] font-semibold text-ink">
                P
              </span>
              <b className="font-[family-name:var(--font-display)] text-lg">PesaRate</b>
            </div>
            <Link to="/dashboard" className="text-sm font-medium text-paper/80 hover:text-paper">
              Open workspace <ArrowRight className="inline ml-1" size={15} />
            </Link>
          </nav>

          <section className="max-w-4xl pt-20 sm:pt-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/[0.06] px-3 py-2 text-xs font-medium text-paper/70 backdrop-blur-sm">
              <Sparkles size={14} className="text-marigold" /> Financial intelligence for moving money
            </div>
            <h1 className="mt-7 font-[family-name:var(--font-display)] text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">
              Know what your money is worth.
              <br />
              <span className="text-paper/40">Know what it means.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-paper/60 sm:text-lg">
              PesaRate helps you convert currencies, understand rate movements, track important
              conversions, plan travel money, and make better decisions before you move or spend.
            </p>
            <Link
              to="/dashboard"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_16px_40px_rgba(198,241,53,.22)]"
            >
              Enter PesaRate <ArrowRight size={16} />
            </Link>
          </section>

          <section className="mt-24 grid gap-4 pb-16 sm:grid-cols-3">
            {pillars.map(([Icon, title, desc]) => (
              <div key={title} className="ticket p-5 backdrop-blur-sm">
                <Icon size={20} className="text-marigold" />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/55">{desc}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
