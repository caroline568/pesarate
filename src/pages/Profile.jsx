import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Edit3, LogOut, Save, Sparkles, Star, Trash2, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSavedConversions } from "../hooks/useSavedConversions";
import { tripsApi } from "../api-client";
import { Card } from "../components/Card";
import { PURPOSE_OPTIONS, saveFeedbackEntry } from "../utils/personalization";

const AVATAR_CHOICES = ["💸", "✈️", "💻", "🌍", "💱", "🧳", "💼", "🏦"];

export default function Profile() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { items: conversions } = useSavedConversions();
  const [trips, setTrips] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [useCases, setUseCases] = useState(user?.use_cases || []);
  const [busy, setBusy] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackConsent, setFeedbackConsent] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [feedbackDismissed, setFeedbackDismissed] = useState(() => {
    try {
      return localStorage.getItem("pesarate-feedback-prompt") === "dismissed";
    } catch {
      return false;
    }
  });
  const fileRef = useRef(null);

  useEffect(() => {
    tripsApi.list().then((data) => setTrips(data.trips || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
    setUseCases(user?.use_cases || []);
  }, [user]);

  const initials = (user?.name || user?.email || "?").split(/\s+/).map((item) => item[0]).join("").slice(0, 2).toUpperCase();
  const future = useMemo(() => trips.filter((trip) => new Date(`${trip.travel_date}T23:59:59`) > new Date()).length, [trips]);
  const meaningfulUsage = useMemo(() => conversions.length > 0 || trips.length > 0 || future > 0, [conversions.length, trips.length, future]);
  const showFeedbackPrompt = meaningfulUsage && !feedbackDismissed && !feedbackSaved;

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setBusy(true);
    try {
      await updateProfile({ name: name.trim(), avatar, use_cases: useCases });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (window.confirm("Delete your PesaRate account and all saved data?")) await deleteAccount();
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackRating) {
      setFeedbackError("Please select a star rating.");
      return;
    }

    if (feedbackText.trim().length < 10) {
      setFeedbackError("Tell us a little more so we can improve your experience.");
      return;
    }

    saveFeedbackEntry({
      rating: feedbackRating,
      message: feedbackText.trim(),
      testimonialConsent: feedbackConsent,
      createdAt: new Date().toISOString(),
    });

    setFeedbackSaved(true);
    setFeedbackDismissed(true);
    try {
      localStorage.setItem("pesarate-feedback-prompt", "dismissed");
    } catch {
      // ignore localStorage issues
    }
    setFeedbackError("");
  };

  const handleMaybeLater = () => {
    setFeedbackDismissed(true);
    try {
      localStorage.setItem("pesarate-feedback-prompt", "dismissed");
    } catch {
      // ignore localStorage issues
    }
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Profile</p>
        <h1 className="mt-1 text-[18px] font-bold">Your account</h1>
      </div>

      {showFeedbackPrompt && (
        <div className="mb-4 rounded-[22px] border border-[#dfeee0] bg-[#f4faf3] p-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf9ed] text-[#43b34d]"><Sparkles size={14} /></span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#43b34d]">Feedback</p>
                <p className="mt-1 text-sm font-bold">Enjoying PesaRate? Tell us what you think.</p>
              </div>
            </div>
            <button type="button" onClick={handleMaybeLater} aria-label="Dismiss feedback prompt" className="text-slate-400">
              <X size={14} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFeedbackRating(value)}
                className="rounded-full p-1 text-slate-300 transition hover:text-[#e2bb5b]"
                aria-label={`Rate ${value} out of 5`}
              >
                <Star size={15} fill={value <= feedbackRating ? "#e2bb5b" : "none"} className={value <= feedbackRating ? "text-[#e2bb5b]" : "text-slate-300"} />
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!feedbackRating) {
                  setFeedbackError("Please pick a rating before sending.");
                  return;
                }
                handleFeedbackSubmit();
              }}
              className="rounded-lg bg-[#55c94b] px-3 py-2 text-[9px] font-bold text-white"
            >
              Send
            </button>
            <button type="button" onClick={handleMaybeLater} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[9px] font-semibold text-slate-600">
              Maybe later
            </button>
          </div>

          {feedbackError && <p className="mt-2 text-[10px] text-red-600">{feedbackError}</p>}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="grid h-20 w-20 overflow-hidden place-items-center rounded-full bg-[#102a4a] text-xl font-bold text-white">
                {avatar ? <img src={avatar} alt="Profile avatar" className="h-full w-full object-cover" /> : initials}
              </span>
              {editing && (
                <button aria-label="Change profile photo" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#55c94b] text-white shadow-md">
                  <Camera size={13} />
                </button>
              )}
              <input ref={fileRef} onChange={onFile} type="file" accept="image/*" className="hidden" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold">{user?.name || "PesaRate User"}</h2>
              <p className="mt-1 truncate text-[10px] text-slate-400">{user?.email}</p>
              <p className="mt-2 text-[8px] text-slate-400">Profile / Account</p>
            </div>

            <button onClick={() => setEditing((current) => !current)} className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold">
              <Edit3 size={12} />
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editing && (
            <div className="mt-6">
              <label className="block text-[10px] font-semibold text-slate-500">
                Full name
                <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-xs focus:border-[#55c94b] focus:outline-none" />
              </label>

              <div className="mt-5">
                <p className="text-[10px] font-semibold text-slate-500">Choose an avatar icon</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AVATAR_CHOICES.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setAvatar(choice)}
                      className={`grid h-10 w-10 place-items-center rounded-full border text-lg transition ${avatar === choice ? "border-[#55c94b] bg-[#f1faef]" : "border-slate-200 bg-white hover:border-slate-300"}`}
                    >
                      {choice}
                    </button>
                  ))}
                  <button type="button" onClick={() => setAvatar("")} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-semibold text-slate-600">
                    Remove
                  </button>
                </div>
              </div>

              <fieldset className="mt-5">
                <legend className="text-[10px] font-semibold text-slate-500">What brings you to PesaRate?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PURPOSE_OPTIONS.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-[10px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={useCases.includes(option.id)}
                        onChange={() =>
                          setUseCases((current) =>
                            current.includes(option.id)
                              ? current.filter((item) => item !== option.id)
                              : [...current, option.id]
                          )
                        }
                        className="accent-[#55c94b]"
                      />
                      <span>{option.icon} {option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setEditing(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-slate-600">Cancel</button>
                <button onClick={save} disabled={busy} className="flex items-center gap-1 rounded-lg bg-[#55c94b] px-3 py-2 text-[9px] font-bold text-white disabled:opacity-60">
                  <Save size={12} />
                  {busy ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {future > 0 && (
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-[8px] uppercase tracking-[.12em] text-slate-400">Upcoming trips</p>
                <p className="mt-2 text-base font-bold text-slate-900">{future}</p>
              </div>
            )}
            <div className="rounded-xl bg-slate-50 p-2">
              <p className="text-[8px] uppercase tracking-[.12em] text-slate-400">Saved conversions</p>
              <p className="mt-2 text-base font-bold text-slate-900">{conversions.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-2">
              <p className="text-[8px] uppercase tracking-[.12em] text-slate-400">Account</p>
              <p className="mt-2 text-base font-bold text-slate-900">Active</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Help & Feedback</p>
                <h3 className="mt-1 text-base font-bold">Tell us what you think</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold uppercase tracking-[.1em] text-slate-500">Private</span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFeedbackRating(value)}
                  className="rounded-full p-1 transition hover:scale-105"
                  aria-label={`Rate ${value} out of 5`}
                >
                  <Star size={18} fill={value <= feedbackRating ? "#e2bb5b" : "none"} className={value <= feedbackRating ? "text-[#e2bb5b]" : "text-slate-300"} />
                </button>
              ))}
            </div>

            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              rows={5}
              placeholder="Share your experience, a pain point, or a feature you’d love to see."
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#55c94b] focus:outline-none"
            />

            <label className="mt-3 flex items-start gap-2 text-[10px] text-slate-500">
              <input type="checkbox" checked={feedbackConsent} onChange={(event) => setFeedbackConsent(event.target.checked)} className="mt-0.5 accent-[#55c94b]" />
              I’m happy for my feedback to be considered as a testimonial.
            </label>

            {feedbackError && <p className="mt-2 text-[10px] text-red-600">{feedbackError}</p>}

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={handleFeedbackSubmit} className="rounded-lg bg-[#55c94b] px-3 py-2 text-[9px] font-bold text-white">
                Send feedback
              </button>
              <button type="button" onClick={() => { setFeedbackRating(0); setFeedbackText(""); setFeedbackConsent(false); setFeedbackError(""); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[9px] font-semibold text-slate-600">
                Clear
              </button>
            </div>

            <p className="mt-3 text-[9px] text-slate-400">Feedback stays in-app unless you explicitly opt in to share it.</p>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Security</p>
                <h3 className="mt-1 text-base font-bold">More control</h3>
              </div>
              <button onClick={logout} className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[9px] font-semibold text-red-600">
                <LogOut size={12} />
                Log out
              </button>
            </div>
            <button onClick={remove} className="flex w-full items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[9px] font-bold text-red-600">
              <Trash2 size={12} />
              Delete account
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
