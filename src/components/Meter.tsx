"use client";

import { gameConfig } from "@/lib/config";

type MeterProps = {
  value: number;
  label?: string;
};

export const Meter = ({ value, label = "Vibe Meter" }: MeterProps) => {
  const segments = 5;
  const clamped = Math.max(0, Math.min(gameConfig.suspicionClamp.max, value));
  const filled = Math.round((clamped / gameConfig.suspicionClamp.max) * segments);

  return (
    <div className="rounded-2xl border-2 border-white/80 bg-white/80 p-3 shadow-lg">
      <div className="flex items-center justify-between text-xs font-semibold uppercase text-rose-400">
        <span>{label}</span>
        <span>{filled}/{segments}</span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: segments }).map((_, index) => {
          const isActive = index < filled;
          return (
            <svg
              key={`segment-${index}`}
              className={`h-5 w-5 ${
                isActive ? "text-rose-400" : "text-rose-200/60"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 0.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          );
        })}
      </div>
    </div>
  );
};
