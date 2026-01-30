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
      <div className="animate-sheet-slide relative h-[36vh] min-h-[240px] max-h-[40vh] overflow-hidden rounded-t-[30px] border border-amber-200/70 bg-gradient-to-b from-amber-50/95 via-amber-50/90 to-white/90 px-4 pb-4 pt-4 shadow-[0_-12px_30px_rgba(15,23,42,0.18)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-6 top-3 h-12 w-12 rounded-full bg-rose-200/30 blur-2xl" />
          <div className="absolute right-6 top-6 h-10 w-10 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="absolute bottom-10 left-10 h-10 w-10 rounded-full bg-white/40 blur-xl" />
        </div>
        <div className="relative mx-auto h-1.5 w-12 rounded-full bg-amber-200/90" />
        <div className="relative mt-3 flex items-center justify-between gap-3">
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
        </div>
        <div className="relative mt-3 max-h-[24vh] space-y-2 overflow-y-auto pr-1">
          {questions.map((question) => {
            const isAsked = askedIds.includes(question.id);
            const isPending = pendingId === question.id;
            const isDisabled = disabled || isAsked || Boolean(pendingId);

            return (
              <button
                key={question.id}
                type="button"
                className={`group relative w-full rounded-[18px] border border-amber-100/80 bg-white/90 px-3 py-2 text-left text-sm text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition ${
                  isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white"
                }`}
                onClick={() => onAsk(question.id)}
                disabled={isDisabled}
              >
                <span className={`${isAsked ? "line-through text-slate-400" : ""}`}>
                  {isPending ? "Brewing..." : question.prompt}
                </span>
                {isAsked ? (
                  <span className="absolute right-2 top-2 rotate-6 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500 shadow-sm">
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
