import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, Plane, TrendingUp, Sparkles } from "lucide-react";
import RateTicker from "../components/RateTicker";
import logo from "../assets/pesarate-logo.png";

const pillars = [
  [ArrowLeftRight, "Convert", "Get the number, then understand it."],
  [TrendingUp, "Understand", "See movements, trends and context."],
  [Plane, "Travel money", "Turn a trip budget into a real spending plan."],
];

export default function Home() {
  return (
    <main className="bureau-bg min-h-screen bg-ink text-paper">
      <RateTicker />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PesaRate" className="h-10 w-10 rounded-xl object-cover" />
            <b className="font-[family-name:var(--font-display)] text-lg">PesaRate</b>
          </div>
          <Link to="/signup" className="text-sm font-medium text-paper/80 hover:text-paper">
            Open workspace <ArrowRight className="inline ml-1" size={15} />
          </Link>
        </nav>

        <section className="max-w-4xl pt-20 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/[0.06] px-3 py-2 text-xs font-medium text-paper/70">
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
            to="/signup"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_16px_40px_rgba(198,241,53,.22)]"
          >
            Enter PesaRate <ArrowRight size={16} />
          </Link>
        </section>

        <section className="mt-24 grid gap-4 pb-16 sm:grid-cols-3">
          {pillars.map(([Icon, title, desc]) => (
            <div key={title} className="ticket p-5">
              <Icon size={20} className="text-marigold" />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/55">{desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
