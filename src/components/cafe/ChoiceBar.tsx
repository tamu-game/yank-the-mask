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
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          className={`flex-1 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition ${
            isDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:-translate-y-0.5 hover:bg-white/90"
          }`}
          onClick={() => onChoose("accuse")}
          disabled={isDisabled}
        >
          Yank the Mask 😈
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition ${
            isDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:-translate-y-0.5 hover:bg-white/90"
          }`}
          onClick={() => onChoose("trust")}
          disabled={isDisabled}
        >
          Trust Them 💖
        </button>
      </div>
      {!canDecide ? (
        <div className="text-[11px] font-semibold text-white/80">
          Ask at least 3 questions first.
        </div>
      ) : null}
    </div>
  );
};
