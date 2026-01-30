"use client";

type ChoiceBarProps = {
  canDecide: boolean;
  disabled?: boolean;
  onChoose: (decision: "accuse" | "trust") => void;
  className?: string;
};

export const ChoiceBar = ({
  canDecide,
  disabled = false,
  onChoose,
  className = ""
}: ChoiceBarProps) => {
  const isDisabled = disabled || !canDecide;

  return (
    <div className={`flex w-full flex-col items-center gap-2 ${className}`}>
      {canDecide ? (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            className={`flex-1 rounded-[999px] border border-rose-200/70 bg-gradient-to-b from-rose-400/95 via-rose-500/95 to-rose-600/95 px-5 py-3.5 text-base font-semibold tracking-[0.01em] text-white shadow-[0_10px_22px_rgba(244,63,94,0.35)] backdrop-blur transition ${
              isDisabled
                ? "cursor-not-allowed opacity-50"
                : "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:active:scale-[0.96]"
            }`}
            onClick={() => onChoose("accuse")}
            disabled={isDisabled}
          >
            <span>Yank the Mask</span>
            <span className="ml-1 text-lg">😈</span>
          </button>
          <button
            type="button"
            className={`flex-1 rounded-[999px] border border-emerald-200/70 bg-gradient-to-b from-emerald-300/95 via-emerald-400/95 to-emerald-500/95 px-5 py-3.5 text-base font-semibold tracking-[0.01em] text-white shadow-[0_10px_22px_rgba(16,185,129,0.3)] backdrop-blur transition ${
              isDisabled
                ? "cursor-not-allowed opacity-50"
                : "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:active:scale-[0.96]"
            }`}
            onClick={() => onChoose("trust")}
            disabled={isDisabled}
          >
            <span>Trust Them</span>
            <span className="ml-1 text-lg">💖</span>
          </button>
        </div>
      ) : (
        <div className="text-[11px] font-semibold text-white/80">
          Ask at least 3 questions first.
        </div>
      )}
    </div>
  );
};
