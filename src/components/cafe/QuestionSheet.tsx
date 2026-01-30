"use client";

import type { QuestionPrompt } from "@/types/game";
import { gameConfig } from "@/lib/config";

type QuestionSheetProps = {
  questions: QuestionPrompt[];
  askedIds: string[];
  pendingId?: string | null;
  onAsk: (questionId: string) => void;
  disabled?: boolean;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
};

export const QuestionSheet = ({
  questions,
  askedIds,
  pendingId,
  onAsk,
  disabled,
  className = "",
  collapsed = false,
  onToggle
}: QuestionSheetProps) => {
  const questionsLeft = Math.max(0, gameConfig.totalQuestions - askedIds.length);
  const isCollapsed = collapsed;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative overflow-hidden rounded-t-[30px] border border-amber-200/70 bg-gradient-to-b from-amber-50/95 via-amber-50/90 to-white/90 px-4 pb-4 pt-4 shadow-[0_-12px_30px_rgba(15,23,42,0.18)] backdrop-blur transform-gpu will-change-[max-height,transform] motion-safe:transition-[max-height,transform] motion-safe:duration-300 motion-safe:ease-out ${
          isCollapsed
            ? "max-h-[78px] min-h-[78px] translate-y-2"
            : "max-h-[40vh] min-h-[240px] translate-y-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-6 top-3 h-12 w-12 rounded-full bg-rose-200/30 blur-2xl" />
          <div className="absolute right-6 top-6 h-10 w-10 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="absolute bottom-10 left-10 h-10 w-10 rounded-full bg-white/40 blur-xl" />
        </div>
        <div className="relative mx-auto h-1.5 w-12 rounded-full bg-amber-200/90" />
        <button
          type="button"
          onClick={onToggle}
          className="relative mt-3 flex w-full items-center justify-between gap-3 text-left"
          aria-expanded={!isCollapsed}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm">
              🍵
            </span>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700/80">
              Menu
            </div>
          </div>
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700/90 shadow-sm">
            Questions left: {questionsLeft}
          </div>
        </button>
        <button
          type="button"
          onClick={onToggle}
          className={`relative mt-2 w-full rounded-full border border-amber-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700/80 shadow-sm transition ${
            isCollapsed ? "hover:-translate-y-[1px]" : "opacity-0 pointer-events-none"
          }`}
        >
          Tap to open menu
        </button>
        <div
          className={`relative mt-3 space-y-2 overflow-y-auto pr-1 transform-gpu will-change-[max-height,opacity,transform] motion-safe:transition-[max-height,opacity,transform] motion-safe:duration-250 motion-safe:ease-out ${
            isCollapsed
              ? "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
              : "max-h-[24vh] opacity-100 translate-y-0"
          }`}
        >
          {questions.map((question) => {
            const isAsked = askedIds.includes(question.id);
            const isPending = pendingId === question.id;
            const isDisabled = disabled || isAsked || Boolean(pendingId);
            const surfaceClasses = isAsked
              ? "border-amber-100/70 bg-gradient-to-b from-amber-50/80 via-white/85 to-amber-50/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(15,23,42,0.06)]"
              : "border-amber-100/80 bg-gradient-to-b from-white/95 via-amber-50/90 to-rose-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(15,23,42,0.08)]";
            const stateClasses = isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer";
            const interactiveClasses = !isDisabled
              ? "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.98] hover:border-amber-200/80"
              : "";

            return (
              <button
                key={question.id}
                type="button"
                className={`group relative w-full rounded-[22px] border px-4 py-3.5 text-left text-[15px] font-medium tracking-[0.01em] text-slate-600 ${surfaceClasses} ${stateClasses} ${interactiveClasses}`}
                onClick={() => onAsk(question.id)}
                disabled={isDisabled}
              >
                <span className={`${isAsked ? "line-through text-slate-500" : ""}`}>
                  {isPending ? "Brewing..." : question.prompt}
                </span>
                {isAsked ? (
                  <span className="absolute right-2 top-2 rotate-6 rounded-full border border-rose-300/70 bg-rose-100/90 px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-rose-500/90 shadow-[0_2px_6px_rgba(244,63,94,0.18)]">
                    ASKED
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
