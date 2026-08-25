import { MoreHorizontal } from "lucide-react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-panel border border-line rounded-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <p className="text-xs font-medium text-white/50">{title}</p>
      {action ?? <MoreHorizontal size={14} className="text-white/30" />}
    </div>
  );
}
