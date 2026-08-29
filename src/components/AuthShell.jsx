import { Link } from "react-router-dom";
import logo from "../assets/pesarate-logo.png";

/**
 * Shared full-bleed backdrop for Login/Signup: soft color-blurred orbs on
 * the ink background so the frosted glass card actually has something to
 * refract, plus the same brand mark as the rest of the app.
 */
export default function AuthShell({ children }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 text-paper">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-lime/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-marigold/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/3 top-10 h-64 w-64 rounded-full bg-coral/15 blur-[100px]" />
      <div className="bureau-bg pointer-events-none absolute inset-0 opacity-40" />

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
