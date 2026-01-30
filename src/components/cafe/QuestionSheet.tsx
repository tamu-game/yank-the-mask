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
};

export const QuestionSheet = ({
  questions,
  askedIds,
  pendingId,
  onAsk,
  disabled,
  className = ""
}: QuestionSheetProps) => {
  const questionsLeft = Math.max(0, gameConfig.totalQuestions - askedIds.length);

  return (
    <div className={`w-full ${className}`}>
      <div className="animate-sheet-slide h-[36vh] min-h-[240px] max-h-[40vh] rounded-t-[28px] border border-white/70 bg-amber-50/90 px-4 pb-4 pt-3 shadow-[0_-12px_28px_rgba(15,23,42,0.25)] backdrop-blur">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-amber-200/80" />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700/80">
            Menu
          </div>
          <div className="text-xs font-semibold text-amber-700/90">
            Questions left: {questionsLeft}
          </div>
        </div>
        <div className="mt-3 max-h-[24vh] space-y-2 overflow-y-auto pr-1">
          {questions.map((question) => {
            const isAsked = askedIds.includes(question.id);
            const isPending = pendingId === question.id;
            const isDisabled = disabled || isAsked || Boolean(pendingId);

            return (
              <button
                key={question.id}
                type="button"
                className={`group relative w-full rounded-2xl border border-amber-100 bg-white/85 px-3 py-2 text-left text-sm text-slate-700 transition ${
                  isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white/95"
                }`}
                onClick={() => onAsk(question.id)}
                disabled={isDisabled}
              >
                <span className={`${isAsked ? "line-through text-slate-400" : ""}`}>
                  {isPending ? "Brewing..." : question.prompt}
                </span>
                {isAsked ? (
                  <span className="absolute right-2 top-2 rotate-6 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
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
