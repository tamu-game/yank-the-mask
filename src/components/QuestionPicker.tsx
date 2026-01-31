"use client";

import type { QuestionPublic } from "@/types/game";
import { Button } from "@/components/Button";

type QuestionPickerProps = {
  questions: QuestionPublic[];
  askedIds: string[];
  pendingId?: string | null;
  onAsk: (questionId: string) => void;
  disabled?: boolean;
};

export const QuestionPicker = ({
  questions,
  askedIds,
  pendingId,
  onAsk,
  disabled
}: QuestionPickerProps) => {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="text-sm font-semibold text-slate-100">Ask a question</div>
      <div className="space-y-2">
        {questions.map((question) => {
          const isAsked = askedIds.includes(question.id);
          const isPending = pendingId === question.id;
          return (
            <Button
              key={question.id}
              variant={isAsked ? "secondary" : "outline"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onAsk(question.id)}
              disabled={disabled || isAsked || Boolean(pendingId)}
            >
              {isPending ? "Sending..." : question.prompt}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
