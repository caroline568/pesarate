import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bureau-bg grid min-h-screen place-items-center bg-ink px-4 text-paper">
      <form onSubmit={submit} className="ticket w-full max-w-sm p-7">
        <UserPlus className="text-lime" />
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-medium">Create an account</h1>
        <p className="mt-1 text-sm text-paper/50">Your saved conversions and alerts follow you across devices.</p>

        <label className="mt-6 block text-xs text-paper/50">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl bg-paper/[0.06] p-3 outline-none" />
        <label className="mt-4 block text-xs text-paper/50">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl bg-paper/[0.06] p-3 outline-none" />
        <label className="mt-4 block text-xs text-paper/50">Password</label>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl bg-paper/[0.06] p-3 outline-none" />
        <p className="mt-1 text-[11px] text-paper/40">At least 8 characters.</p>

        {error && <p className="mt-3 text-sm text-coral" role="alert">{error}</p>}

        <button type="submit" disabled={submitting} className="mt-6 w-full rounded-xl bg-lime py-3 text-sm font-semibold text-ink disabled:opacity-60">
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="mt-4 text-center text-xs text-paper/45">
          Already have an account? <Link to="/login" className="text-lime">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
