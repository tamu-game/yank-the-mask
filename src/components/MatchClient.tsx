"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { CharacterPreview, QuestionPublic, SessionPublic } from "@/types/game";
import { gameConfig } from "@/lib/config";
import { CafeScene } from "@/components/cafe/CafeScene";
import { QuestionSheet } from "@/components/cafe/QuestionSheet";
import { ChoiceBar } from "@/components/cafe/ChoiceBar";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { apiFetch, isApiError } from "@/lib/apiClient";
import { GuessDistribution } from "@/components/GuessDistribution";
import type { GuessDistributionData } from "@/types/stats";

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

type ResultOverlay = {
  decision: "accuse" | "trust";
  outcome: "win" | "lose";
};

type RevealPhase = "idle" | "yank" | "alien" | "angry_init" | "angry_loop";

const resultCopy: Record<string, { title: string; line: string; status: string }> = {
  "accuse-win": {
    title: "Mask Pulled!",
    line: "The alien froze mid-smile. The ship is already on its way.",
    status: "You win"
  },
  "accuse-lose": {
    title: "Wrong Mask",
    line: "Awkward silence. A gentle slap. You deserved it.",
    status: "You lose"
  },
  "trust-win": {
    title: "Good Vibes",
    line: "No abductions today. Just a warm, human connection.",
    status: "You win"
  },
  "trust-lose": {
    title: "Beam Me Up",
    line: "You trusted the mask. A UFO trusted your address.",
    status: "You lose"
  }
};

type MatchClientProps = {
  character: CharacterPreview;
  questions: QuestionPublic[];
  sessionId: string | null;
};

export const MatchClient = ({
  character,
  questions,
  sessionId
}: MatchClientProps) => {
  const router = useRouter();
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<"accuse" | "trust" | null>(null);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [typingDelay, setTypingDelay] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [revealPhase, setRevealPhase] = useState<RevealPhase>("idle");
  const [resultOverlay, setResultOverlay] = useState<ResultOverlay | null>(null);
  const [talkActive, setTalkActive] = useState(false);
  const [isResultCollapsed, setIsResultCollapsed] = useState(false);
  const [persistentSummary, setPersistentSummary] = useState<{
    score: number;
    status: "COMPLETED" | "ABANDONED";
    outcome: "WIN" | "LOSE" | null;
    guessedAtQuestion: number | null;
  } | null>(null);
  const [statsData, setStatsData] = useState<GuessDistributionData | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const lastTurnIdRef = useRef<string | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const talkTimerRef = useRef<number | null>(null);
  const startPromiseRef = useRef<Promise<boolean> | null>(null);

  const { data: session, mutate } = useSWR(
    sessionId ? `/api/session/${sessionId}` : null,
    fetcher
  );

  const askedIds = session?.askedQuestionIds ?? [];
  const askedCount = askedIds.length;
  const minQuestionsToDecide = gameConfig.minQuestionsToDecide;
  const canDecide = askedCount >= minQuestionsToDecide && session?.status === "in_progress";
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

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
      }
      if (talkTimerRef.current) {
        window.clearTimeout(talkTimerRef.current);
      }
    };
  }, []);

  const ensurePersistentSession = useCallback(async () => {
    if (!sessionId) return false;
    if (!startPromiseRef.current) {
      startPromiseRef.current = apiFetch<{ sessionId: string }>("/api/sessions/start", {
        method: "POST",
        body: JSON.stringify({ sessionId, characterId: character.id })
      })
        .then(() => true)
        .catch((err) => {
          if (isApiError(err) && err.status === 401) {
            return false;
          }
          return false;
        });
    }
    return startPromiseRef.current;
  }, [sessionId]);

  const recordEvent = useCallback(
    async (type: "QUESTION_ASKED" | "CORRECT_GUESS" | "WRONG_GUESS") => {
      if (!sessionId) return;
      const ready = await ensurePersistentSession();
      if (!ready) return;
      try {
        await apiFetch(`/api/sessions/${sessionId}/event`, {
          method: "POST",
          body: JSON.stringify({ type })
        });
      } catch (err) {
        if (isApiError(err) && err.status === 401) return;
      }
    },
    [ensurePersistentSession, sessionId]
  );

  const finishSession = useCallback(
    async (status: "COMPLETED" | "ABANDONED", outcome?: "WIN" | "LOSE") => {
      if (!sessionId) return;
      const ready = await ensurePersistentSession();
      if (!ready) return;
      try {
        const data = await apiFetch<{
          score: number;
          status: "COMPLETED" | "ABANDONED";
          outcome: "WIN" | "LOSE" | null;
          guessedAtQuestion: number | null;
        }>(
          `/api/sessions/${sessionId}/finish`,
          {
            method: "POST",
            body: JSON.stringify({
              status,
              outcome,
              questionCount: askedCount,
              characterId: character.id
            })
          }
        );
        setPersistentSummary({
          score: data.score,
          status: data.status,
          outcome: data.outcome,
          guessedAtQuestion: data.guessedAtQuestion
        });
      } catch (err) {
        if (isApiError(err) && err.status === 401) return;
      }
    },
    [ensurePersistentSession, sessionId]
  );

  useEffect(() => {
    if (!sessionId) return;
    void ensurePersistentSession();
  }, [ensurePersistentSession, sessionId]);

  useEffect(() => {
    if (!resultOverlay) return;
    setStatsLoading(true);
    setStatsError(null);
    setStatsData(null);
    apiFetch<GuessDistributionData>(
      `/api/stats/guess-distribution?characterId=${character.id}`
    )
      .then((data) => setStatsData(data))
      .catch(() => setStatsError("İstatistikler alınamadı."))
      .finally(() => setStatsLoading(false));
  }, [character.id, resultOverlay]);

  useEffect(() => {
    if (!pendingQuestionId) return;
    if (talkTimerRef.current) {
      window.clearTimeout(talkTimerRef.current);
    }
    setTalkActive(true);
    talkTimerRef.current = window.setTimeout(() => {
      setTalkActive(false);
    }, 1200);
  }, [pendingQuestionId]);

  const handleAsk = async (questionId: string) => {
    if (!sessionId) return;
    if (pendingQuestionId) return;
    setError(null);
    setPendingQuestionId(questionId);
    setIsSheetCollapsed(true);

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
      void recordEvent("QUESTION_ASKED");
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
      const chosenDecision = decision;
      const response = await fetch(`/api/session/${sessionId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Failed to decide.");
      }
      const outcome = data?.outcome as ResultOverlay["outcome"] | undefined;
      if (!outcome) {
        throw new Error("Failed to decide.");
      }
      const shouldPlayYank =
        (chosenDecision === "accuse" && outcome === "win") ||
        (chosenDecision === "trust" && outcome === "lose");
      const shouldPlayAngry = chosenDecision === "accuse" && outcome === "lose";
      void (async () => {
        const eventType = outcome === "win" ? "CORRECT_GUESS" : "WRONG_GUESS";
        const finalOutcome = outcome === "win" ? "WIN" : "LOSE";
        await recordEvent(eventType);
        await finishSession("COMPLETED", finalOutcome);
      })();
      if (shouldPlayYank) {
        setRevealPhase("yank");
        setResultOverlay({ decision: chosenDecision, outcome });
        if (revealTimerRef.current) {
          window.clearTimeout(revealTimerRef.current);
        }
        revealTimerRef.current = window.setTimeout(() => {
          setRevealPhase("alien");
        }, gameConfig.yankMaskDurationMs);
        return;
      }
      if (shouldPlayAngry) {
        setRevealPhase("angry_init");
        setResultOverlay({ decision: chosenDecision, outcome });
        if (revealTimerRef.current) {
          window.clearTimeout(revealTimerRef.current);
        }
        revealTimerRef.current = window.setTimeout(() => {
          setRevealPhase("angry_loop");
        }, gameConfig.angryInitDurationMs);
        return;
      }
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
      }
      setRevealPhase("idle");
      setResultOverlay({ decision: chosenDecision, outcome });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDecision(null);
    }
  };

  const isTyping = Boolean(pendingQuestionId) || typingDelay;
  const isQuestionTyping = isTyping && Boolean(questionText);
  const answerText = lastTurn?.answerText ?? null;
  const resultKey = resultOverlay
    ? `${resultOverlay.decision}-${resultOverlay.outcome}`
    : null;
  const story = resultKey ? resultCopy[resultKey] : null;
  const showResultOverlay = Boolean(story);
  const playerOutcome = resultOverlay
    ? resultOverlay.outcome === "win"
      ? "WIN"
      : "LOSE"
    : null;
  const playerGuessedAtQuestion =
    playerOutcome === "WIN"
      ? persistentSummary?.guessedAtQuestion ?? askedCount
      : null;
  const isAccuseWin =
    resultOverlay?.decision === "accuse" && resultOverlay?.outcome === "win" && showResultOverlay;
  const isAccuseLose =
    resultOverlay?.decision === "accuse" && resultOverlay?.outcome === "lose" && showResultOverlay;
  const isTrustLose =
    resultOverlay?.decision === "trust" && resultOverlay?.outcome === "lose" && showResultOverlay;
  const loveActive =
    resultOverlay?.decision === "trust" && resultOverlay?.outcome === "win" && showResultOverlay;
  const portraitOverrideSrc =
    revealPhase === "yank"
      ? isAccuseWin
        ? "/characters/yank_mask_win.gif"
        : isTrustLose
          ? "/characters/yank_mask_lose.gif"
          : "/characters/yank_mask.gif"
      : revealPhase === "angry_init"
        ? "/characters/angry_init.gif"
        : revealPhase === "angry_loop"
          ? "/characters/angry_loop.gif"
          : revealPhase === "alien"
        ? isAccuseWin
          ? "/characters/alien_cry.gif"
          : isTrustLose
            ? "/characters/alien_laugh.gif"
          : "/characters/alien.png"
        : loveActive
          ? "/characters/love.gif"
          : talkActive
            ? "/characters/talk.gif"
            : "/characters/character.gif";
  const portraitOverrideAlt =
    revealPhase === "angry_init"
      ? "Angry reveal"
      : revealPhase === "angry_loop"
        ? "Angry loop"
        : revealPhase === "alien"
      ? isAccuseWin
        ? "Alien crying"
        : isTrustLose
          ? "Alien laughing"
        : "Alien revealed"
      : revealPhase === "yank"
        ? isAccuseWin
          ? "Yank mask win"
          : isTrustLose || isAccuseLose
            ? "Yank mask lose"
            : "Yank mask reveal"
        : loveActive
          ? "Love reveal"
          : talkActive
            ? "Character talking"
            : "Character idle";

  if (!sessionId) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <CafeScene
          className="absolute inset-0"
          character={character}
          questionText={null}
          answerText={null}
          answerKey={null}
          portraitOverrideSrc={portraitOverrideSrc}
          portraitOverrideAlt={portraitOverrideAlt}
          isTyping={false}
          glitch={false}
          suspicion={0}
          onBack={() => setExitConfirm(true)}
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
        answerText={showResultOverlay ? null : answerText}
        answerKey={lastTurnId}
        portraitOverrideSrc={portraitOverrideSrc}
        portraitOverrideAlt={portraitOverrideAlt}
        isTyping={showResultOverlay ? false : isTyping}
        glitch={glitchActive}
        suspicion={session?.suspicion ?? 0}
        onBack={() => setExitConfirm(true)}
      />
      {story ? (
        <div className="pointer-events-none absolute inset-x-0 top-[10%] z-30 flex justify-center px-6 text-center">
          <div className="relative max-w-md text-slate-700">
            <div className="pointer-events-none absolute left-1/2 top-4 h-40 w-80 -translate-x-1/2 rounded-full bg-rose-200/70 blur-[110px]" />
            <div className="relative text-base font-semibold uppercase tracking-[0.4em] text-rose-400">
              {story.status}
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-700">{story.title}</div>
            <p className="mt-2 text-base text-slate-600">{story.line}</p>
          </div>
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-4">
        {questionText && !showResultOverlay ? (
          <div
            className={`w-full max-w-xl transform-gpu will-change-[opacity,transform] motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out ${
              isSheetCollapsed
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 translate-y-3"
            }`}
          >
            <div className="animate-bubble-pop rounded-[18px] border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700/70">
                Your note
              </div>
              <div className="mt-1 leading-relaxed">
                <span className={isQuestionTyping ? "typing-reveal" : ""}>{questionText}</span>
                {isQuestionTyping ? (
                  <span className="ml-2 inline-flex items-center gap-1 align-baseline">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                    <span
                      className="typing-dot h-1.5 w-1.5 rounded-full bg-amber-500/70"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="typing-dot h-1.5 w-1.5 rounded-full bg-amber-500/70"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {story ? (
          <div className="pointer-events-auto w-full max-w-xl">
            <div
              className={`flex flex-col rounded-[24px] border border-white/70 bg-white/95 text-center shadow-2xl transition-all duration-300 ease-out ${
                isResultCollapsed
                  ? "cursor-pointer px-4 py-3 max-h-[140px] overflow-hidden"
                  : "cursor-pointer p-5 max-h-[60vh] overflow-y-auto"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => setIsResultCollapsed((prev) => !prev)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsResultCollapsed((prev) => !prev);
                }
              }}
            >
              <div
                className={`transition-all duration-300 ease-out ${
                  isResultCollapsed ? "max-h-0 opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                {persistentSummary ? (
                  <div className="mt-4 rounded-2xl border border-amber-100/70 bg-white/80 px-4 py-3 text-left text-xs text-slate-600">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
                      Session recap
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>Score</span>
                      <span className="font-semibold text-slate-700">
                        {persistentSummary.score}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span>Status</span>
                      <span className="font-semibold text-slate-700">
                        {persistentSummary.status}
                      </span>
                    </div>
                  </div>
                ) : null}
                {statsLoading ? (
                  <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-slate-500">
                    İstatistikler yükleniyor...
                  </div>
                ) : statsError ? (
                  <div className="mt-4 rounded-2xl border border-rose-100/70 bg-rose-50/70 px-4 py-3 text-xs text-rose-600">
                    {statsError}
                  </div>
                ) : statsData ? (
                  <div className="mt-4">
                    <GuessDistribution
                      data={statsData}
                      playerOutcome={playerOutcome}
                      playerGuessedAtQuestion={playerGuessedAtQuestion}
                    />
                  </div>
                ) : null}
              </div>
              <div className="mb-2 flex justify-center">
                <button
                  type="button"
                  className="h-1.5 w-12 rounded-full bg-amber-200/90 focus:outline-none"
                  aria-label={isResultCollapsed ? "Expand details" : "Collapse details"}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsResultCollapsed((prev) => !prev);
                  }}
                />
              </div>
              <Button
                className={isResultCollapsed ? "w-full" : "mt-5 w-full"}
                onClick={(event) => {
                  event.stopPropagation();
                  router.push("/feed");
                }}
              >
                Play again
              </Button>
            </div>
          </div>
        ) : (
          <>
            <QuestionSheet
              className="pointer-events-auto w-full max-w-xl"
              character={character}
              questions={questions}
              askedIds={askedIds}
              pendingId={pendingQuestionId}
              onAsk={handleAsk}
              disabled={!session || session.status !== "in_progress"}
              collapsed={isSheetCollapsed}
              onToggle={() => setIsSheetCollapsed((prev) => !prev)}
            />
            <ChoiceBar
              className="pointer-events-auto w-full max-w-xl"
              canDecide={canDecide}
              minQuestionsToDecide={minQuestionsToDecide}
              disabled={Boolean(pendingQuestionId) || session?.status !== "in_progress"}
              onChoose={(value) => setDecision(value)}
            />
          </>
        )}
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
      {exitConfirm ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-6 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-[24px] border border-white/70 bg-white/95 p-5 text-center shadow-2xl">
            <div className="text-base font-semibold text-slate-700">Quit the date?</div>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure to quit? Your progress is lost.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5"
                onClick={() => setExitConfirm(false)}
              >
                Stay
              </button>
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                onClick={() => {
                  void finishSession("ABANDONED");
                  router.push("/feed");
                }}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
