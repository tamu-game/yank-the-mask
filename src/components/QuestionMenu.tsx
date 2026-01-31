"use client";

import type { QuestionPublic } from "@/types/game";

type QuestionMenuProps = {
  questions: QuestionPublic[];
  askedIds: string[];
  pendingId?: string | null;
  onAsk: (questionId: string) => void;
  disabled?: boolean;
};

export const QuestionMenu = ({
  questions,
  askedIds,
  pendingId,
  onAsk,
  disabled
}: QuestionMenuProps) => {
  const questionsLeft = Math.max(0, questions.length - askedIds.length);

  return (
    <div className="notebook-panel rounded-[28px] border-2 border-white/80 bg-white/80 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-700">Question Menu</div>
          <div className="text-xs text-slate-500">Pick one to ask your date.</div>
        </div>
        <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
          Questions left: {questionsLeft}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {questions.map((question) => {
          const isAsked = askedIds.includes(question.id);
          const isPending = pendingId === question.id;
          const isDisabled = disabled || isAsked || Boolean(pendingId);

          return (
            <button
              key={question.id}
              type="button"
              className={`group relative w-full rounded-2xl border border-rose-100 bg-white/90 px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition ${
                isDisabled
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
              }`}
              onClick={() => onAsk(question.id)}
              disabled={isDisabled}
            >
              <span className={`${isAsked ? "line-through text-slate-400" : ""}`}>
                {isPending ? "Brewing..." : question.prompt}
              </span>
              {isAsked ? (
                <span className="absolute right-3 top-2 rotate-6 rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                  ASKED
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
