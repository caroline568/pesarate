import { useState } from "react";

const PETALS = ["🌸", "🌼", "💐", "🌺", "✨"];

/**
 * A one-shot burst of falling flower/sparkle particles, purely CSS-driven
 * (no dependency) — used to welcome a brand new user on successful signup.
 * Renders nothing and animates nothing if the user prefers reduced motion.
 */
export default function FlowerConfetti({ count = 60 }) {
  // Lazy initializer: randomizing once at mount is intentional here (a
  // one-shot celebratory burst), so this runs outside React's render pass.
  const [pieces] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.6 + Math.random() * 1.8,
      size: 14 + Math.random() * 16,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 160,
      emoji: PETALS[Math.floor(Math.random() * PETALS.length)],
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10%] select-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animation: `flower-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            "--drift": `${p.drift}px`,
            "--rotate": `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes flower-fall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 115vh) rotate(var(--rotate)); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
