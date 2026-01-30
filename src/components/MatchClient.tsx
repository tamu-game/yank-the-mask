"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { CharacterPreview, QuestionPrompt, SessionPublic } from "@/types/game";
import { CafeScene } from "@/components/cafe/CafeScene";
import { QuestionSheet } from "@/components/cafe/QuestionSheet";
import { ChoiceBar } from "@/components/cafe/ChoiceBar";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load session.");
  }
  return data as SessionPublic;
};

const stableGlitch = (id: string, chance: number) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  const normalized = (hash % 100) / 100;
  return normalized < chance;
};

type MatchClientProps = {
  character: CharacterPreview;
  questions: QuestionPrompt[];
  sessionId: string | null;
};

export const MatchClient = ({ character, questions, sessionId }: MatchClientProps) => {
  const router = useRouter();
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<"accuse" | "trust" | null>(null);
  const [typingDelay, setTypingDelay] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const lastTurnIdRef = useRef<string | null>(null);

  const { data: session, mutate } = useSWR(
    sessionId ? `/api/session/${sessionId}` : null,
    fetcher
  );

  const askedIds = session?.askedQuestionIds ?? [];
  const askedCount = askedIds.length;
  const canDecide = askedCount >= 3 && session?.status === "in_progress";
  const lastTurn = session?.turns?.[session.turns.length - 1] ?? null;
  const lastTurnId = lastTurn?.id ?? null;
  const pendingQuestion = pendingQuestionId
    ? questions.find((item) => item.id === pendingQuestionId)
    : null;
  const questionText = pendingQuestion?.prompt ?? lastTurn?.questionPrompt ?? null;
  const glitch = lastTurn ? stableGlitch(lastTurn.id, lastTurn.glitchChance) : false;

  useEffect(() => {
    if (!lastTurnId || lastTurnIdRef.current === lastTurnId) return;
    lastTurnIdRef.current = lastTurnId;
    setTypingDelay(true);
    const delay = 420 + Math.random() * 280;
    const timer = window.setTimeout(() => setTypingDelay(false), delay);
    return () => window.clearTimeout(timer);
  }, [lastTurnId]);

  useEffect(() => {
    if (pendingQuestionId) {
      setTypingDelay(true);
    }
  }, [pendingQuestionId]);

  useEffect(() => {
    if (!pendingQuestionId && !lastTurnId) {
      setTypingDelay(false);
    }
  }, [pendingQuestionId, lastTurnId]);

  useEffect(() => {
    if (!lastTurnId || !glitch) {
      setGlitchActive(false);
      return;
    }
    setGlitchActive(true);
    const timer = window.setTimeout(() => setGlitchActive(false), 250);
    return () => window.clearTimeout(timer);
  }, [glitch, lastTurnId]);

  const handleAsk = async (questionId: string) => {
    if (!sessionId) return;
    if (pendingQuestionId) return;
    setError(null);
    setPendingQuestionId(questionId);

    try {
      const response = await fetch(`/api/session/${sessionId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Failed to ask question.");
      }
      mutate(
        (current) =>
          current
            ? {
                ...current,
                askedQuestionIds: [...current.askedQuestionIds, questionId],
                turns: [...current.turns, data.turn],
                suspicion: data.suspicionAfter
              }
            : current,
        false
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPendingQuestionId(null);
    }
  };

  const confirmDecision = async () => {
    if (!sessionId || !decision) return;
    setError(null);
    try {
      const response = await fetch(`/api/session/${sessionId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Failed to decide.");
      }
      router.push(`/result/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDecision(null);
    }
  };

  const isTyping = Boolean(pendingQuestionId) || typingDelay;
  const answerText = lastTurn?.answerText ?? null;

  if (!sessionId) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <CafeScene
          className="absolute inset-0"
          character={character}
          questionText={null}
          answerText={null}
          isTyping={false}
          glitch={false}
          suspicion={0}
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-lg">
            Cafe table vanished. Head back to the feed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <CafeScene
        className="absolute inset-0"
        character={character}
        questionText={null}
        answerText={answerText}
        isTyping={isTyping}
        glitch={glitchActive}
        suspicion={session?.suspicion ?? 0}
      />
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-4">
        {questionText ? (
          <div className="pointer-events-auto w-full max-w-xl">
            <div className="animate-bubble-pop rounded-[18px] border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700/70">
                Your note
              </div>
              <div className="mt-1 leading-relaxed">{questionText}</div>
            </div>
          </div>
        ) : null}
        <QuestionSheet
          className="pointer-events-auto w-full max-w-xl"
          questions={questions}
          askedIds={askedIds}
          pendingId={pendingQuestionId}
          onAsk={handleAsk}
          disabled={!session || session.status !== "in_progress"}
        />
        <ChoiceBar
          className="pointer-events-auto w-full max-w-xl"
          canDecide={canDecide}
          disabled={Boolean(pendingQuestionId) || session?.status !== "in_progress"}
          onChoose={(value) => setDecision(value)}
        />
        {error ? (
          <div className="pointer-events-auto rounded-full bg-rose-500/80 px-3 py-1 text-[11px] text-rose-50 shadow">
            {error}
          </div>
        ) : null}
      </div>
      {decision ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/30 px-6 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-[24px] border border-white/70 bg-white/90 p-5 text-center shadow-2xl">
            <div className="text-base font-semibold text-slate-700">
              {decision === "accuse" ? "Yank the mask?" : "Trust them?"}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {decision === "accuse"
                ? "If you're wrong, the date ends with a splash."
                : "If they're alien, you're about to be whisked away."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5"
                onClick={() => setDecision(null)}
              >
                Not yet
              </button>
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                onClick={confirmDecision}
              >
                {decision === "accuse" ? "Yank it" : "Trust"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
