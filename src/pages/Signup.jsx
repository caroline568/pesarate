import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthShell from "../components/AuthShell";
import GoogleSignInButton from "../components/GoogleSignInButton";
import FlowerConfetti from "../components/FlowerConfetti";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password, name);
      setCelebrating(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 1800);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      {celebrating && <FlowerConfetti />}
      <form
        onSubmit={submit}
        className="rounded-3xl border border-paper/15 bg-paper/[0.07] p-7 shadow-2xl backdrop-blur-2xl"
      >
        {celebrating ? (
          <div className="py-6 text-center">
            <p className="text-3xl">🌸</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium">
              Welcome to PesaRate{name ? `, ${name}` : ""}!
            </h1>
            <p className="mt-2 text-sm text-paper/55">Taking you to your workspace…</p>
          </div>
        ) : (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-paper/10">
              <UserPlus size={18} className="text-lime" />
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-medium">Create an account</h1>
            <p className="mt-1 text-sm text-paper/55">Your saved conversions and alerts follow you across devices.</p>

            <label className="mt-6 block text-xs text-paper/50">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-paper/10 bg-ink/40 p-3 outline-none focus:border-lime/50"
            />
            <label className="mt-4 block text-xs text-paper/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-paper/10 bg-ink/40 p-3 outline-none focus:border-lime/50"
            />
            <label className="mt-4 block text-xs text-paper/50">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-paper/10 bg-ink/40 p-3 outline-none focus:border-lime/50"
            />
            <p className="mt-1 text-[11px] text-paper/40">At least 8 characters.</p>

            {error && (
              <p className="mt-3 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-lime py-3 text-sm font-semibold text-ink shadow-[0_12px_30px_rgba(198,241,53,.25)] disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
            <GoogleSignInButton />
            <p className="mt-4 text-center text-xs text-paper/45">
              Already have an account? <Link to="/login" className="text-lime">Sign in</Link>
            </p>
          </>
        )}
      </form>
    </AuthShell>
  );
}
