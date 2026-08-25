import { Link } from "react-router-dom";
import heroImage from "../assets/pesarate-hero.png";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#F7F8F5] text-[#111512]"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Full-page hero background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.28] brightness-125"
        />

        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-r from-[#F7F8F5]/95 via-[#F7F8F5]/75 to-[#F7F8F5]/35" />
      </div>

      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#111512_1px,transparent_1px)] bg-size-[22px_22px] opacity-[0.025]"
        aria-hidden="true"
      />

      {/* Landing content */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24">
        <section className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#6B746B]">
            Financial Intelligence
          </p>

          <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-7xl">
            PesaRate
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#5F665F]">
            A financial intelligence and travel money workspace that helps
            people understand exchange rates, track important conversions,
            and make better decisions about moving or spending money.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-hero-accent px-6 py-3 font-medium text-[#111512] shadow-[0_0_30px_-5px_rgba(163,230,53,0.35)] transition hover:bg-[#bef264]"
          >
            Open the workspace
            <i className="ti ti-arrow-right" />
          </Link>
        </section>
      </div>
    </main>
  );
}