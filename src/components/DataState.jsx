import { AlertTriangle, RefreshCw } from "lucide-react";

/** Skeleton shown while a page's first fetch is in flight. */
export function LoadingGrid({ count = 4, className = "" }) {
  return (
    <div className={`grid gap-4 ${className}`} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ticket h-32 skeleton" />
      ))}
    </div>
  );
}

/** Shown when a fetch fails, with a retry affordance. */
export function ErrorState({ message = "Rates didn't load.", onRetry }) {
  return (
    <div className="ticket p-8 text-center" role="alert">
      <AlertTriangle className="mx-auto text-coral" size={22} />
      <p className="mt-3 font-medium text-paper">{message}</p>
      <p className="mt-1 text-sm text-paper/50">The source may be rate-limited or briefly offline.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper/10 px-4 py-2 text-sm font-medium hover:bg-paper/15"
        >
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}

/** Shown when a list is empty, always with a next action. */
export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="ticket border-dashed p-8 text-center">
      {Icon && <Icon className="mx-auto text-paper/35" size={22} />}
      <p className="mt-3 font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-paper/50">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
