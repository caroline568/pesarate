import { Link } from "react-router-dom";
import logo from "../assets/pesarate-logo.png";
import heroBg from "../assets/pesarate-hero-bg.jpg";

/**
 * Shared full-bleed backdrop for Login/Signup: the real PesaRate hero art
 * (currency mockup + globe) behind the frosted glass card, faded into the
 * ink background on the left where the card sits so the two don't compete.
 */
export default function AuthShell({ children }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[position:75%_center] opacity-60"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 30% 50%, var(--color-ink) 0%, var(--color-ink) 35%, rgba(11,22,20,0.5) 60%, rgba(11,22,20,0.2) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-lime/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-marigold/20 blur-[130px]" />

      <div className="relative w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3">
          <img src={logo} alt="PesaRate" className="h-10 w-10 rounded-xl object-cover" />
          <b className="font-[family-name:var(--font-display)] text-lg">PesaRate</b>
        </Link>
        {children}
      </div>
    </main>
  );
}
