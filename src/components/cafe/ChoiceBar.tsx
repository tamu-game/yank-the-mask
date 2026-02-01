"use client";

type ChoiceBarProps = {
  canDecide: boolean;
  minQuestionsToDecide: number;
  disabled?: boolean;
  onChoose: (decision: "accuse" | "trust") => void;
  className?: string;
};

export const ChoiceBar = ({
  canDecide,
  minQuestionsToDecide,
  disabled = false,
  onChoose,
  className = ""
}: ChoiceBarProps) => {
  const isDisabled = disabled || !canDecide;
  const questionLabel = minQuestionsToDecide === 1 ? "question" : "questions";

  return (
    <div className={`flex w-full flex-col items-center gap-2 ${className}`}>
      {canDecide ? (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            className={`flex-1 rounded-[999px] border-2 border-rose-200/80 bg-gradient-to-b from-rose-300/95 via-rose-400/95 to-rose-500/95 px-4 py-2.5 text-sm font-semibold tracking-[0.01em] text-rose-950 shadow-[0_6px_0_rgba(214,94,107,0.3),0_12px_22px_rgba(214,94,107,0.25)] backdrop-blur transition ${
              isDisabled
                ? "cursor-not-allowed opacity-50"
                : "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:active:scale-[0.96]"
            }`}
            onClick={() => onChoose("accuse")}
            disabled={isDisabled}
          >
            <span>Yank the Mask</span>
          </button>
          <button
            type="button"
            className={`flex-1 rounded-[999px] border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-200/95 via-emerald-300/95 to-emerald-400/95 px-4 py-2.5 text-sm font-semibold tracking-[0.01em] text-emerald-950 shadow-[0_6px_0_rgba(56,161,105,0.3),0_12px_22px_rgba(56,161,105,0.25)] backdrop-blur transition ${
              isDisabled
                ? "cursor-not-allowed opacity-50"
                : "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:active:scale-[0.96]"
            }`}
            onClick={() => onChoose("trust")}
            disabled={isDisabled}
          >
            <span>Trust Them</span>
          </button>
        </div>
      ) : (
        <div className="text-[10px] font-semibold text-white/80">
          Ask at least {minQuestionsToDecide} {questionLabel} first.
        </div>
      )}
    </div>
  );
};
