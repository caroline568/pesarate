export const PURPOSE_OPTIONS = [
  { id: "travelling", icon: "✈️", label: "I’m travelling" },
  { id: "international-payments", icon: "💻", label: "I get paid internationally" },
  { id: "remote-work", icon: "🌍", label: "I work remotely" },
  { id: "currency-exchange", icon: "💱", label: "I regularly exchange currencies" },
];

const PURPOSE_KEY = "pesarate-purpose";
const WELCOME_KEY = "pesarate-welcome";
const ONBOARDING_KEY = "pesarate-show-onboarding";
const FEEDBACK_KEY = "pesarate-feedback";

export function getSavedPurposeOptions() {
  try {
    const raw = localStorage.getItem(PURPOSE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => PURPOSE_OPTIONS.some((option) => option.id === item)) : [];
  } catch {
    return [];
  }
}

export function savePurposeOptions(options) {
  const next = Array.isArray(options) ? options.filter((item) => PURPOSE_OPTIONS.some((option) => option.id === item)) : [];
  localStorage.setItem(PURPOSE_KEY, JSON.stringify(next));
}

export function setWelcomeMessage(next) {
  if (next) localStorage.setItem(WELCOME_KEY, "1");
  else localStorage.removeItem(WELCOME_KEY);
}

export function shouldShowWelcomeMessage() {
  return localStorage.getItem(WELCOME_KEY) === "1";
}

export function setOnboardingVisible(next) {
  if (next) localStorage.setItem(ONBOARDING_KEY, "1");
  else localStorage.removeItem(ONBOARDING_KEY);
}

export function shouldShowOnboarding() {
  return localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function getSavedFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFeedbackEntry(entry) {
  const existing = getSavedFeedback();
  const next = [entry, ...existing].slice(0, 6);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
}
