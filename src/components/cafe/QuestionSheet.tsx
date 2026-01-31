"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CharacterPreview, QuestionPublic } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const pickFrom = (pool: string[], count: number, seed: number) => {
  const picks: string[] = [];
  for (let i = 0; i < pool.length && picks.length < count; i += 1) {
    const item = pool[(seed + i * 7) % pool.length];
    if (!picks.includes(item)) {
      picks.push(item);
    }
  }
  return picks;
};

const EXTRA_TRAITS = [
  "warm",
  "clever",
  "independent",
  "romantic",
  "grounded",
  "bold",
  "dreamy",
  "thoughtful"
];

const LIKE_POOL = [
  "late-night cafes",
  "street food",
  "rainy walks",
  "cozy bookstores",
  "sunrise hikes",
  "vinyl playlists",
  "board game nights",
  "spicy noodles",
  "museum dates",
  "night drives",
  "polaroid photos"
];

const DISLIKE_POOL = [
  "ghosting",
  "cold coffee",
  "awkward silences",
  "spoilers",
  "rush-hour crowds",
  "flaky plans",
  "loud chewing",
  "dull small talk"
];

const QUIRK_POOL = [
  "collects matchbooks from cafes",
  "sends voice notes instead of texts",
  "names every plant in sight",
  "always orders dessert first",
  "keeps a lucky charm in their pocket",
  "makes playlists for friends",
  "writes tiny notes in the margins of books"
];

const HANGOUT_POOL = [
  "the corner booth",
  "a rooftop garden",
  "the record shop",
  "the midnight diner",
  "the art museum cafe"
];

const TRAIT_STYLES = [
  "rotate-[-2deg] shadow-md ring-2 ring-amber-200/70",
  "rotate-[1deg] shadow-sm ring-2 ring-sky-200/70",
  "rotate-[-1deg] shadow-sm ring-2 ring-rose-200/70",
  "rotate-[2deg] shadow-md ring-2 ring-emerald-200/70",
  "rotate-[-3deg] shadow-sm ring-2 ring-violet-200/70"
];

const hashToIndex = (value: string, modulo: number) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % modulo;
};

type QuestionSheetProps = {
  character: CharacterPreview;
  questions: QuestionPublic[];
  askedIds: string[];
  pendingId?: string | null;
  onAsk: (questionId: string) => void;
  disabled?: boolean;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
};

export const QuestionSheet = ({
  character,
  questions,
  askedIds,
  pendingId,
  onAsk,
  disabled,
  className = "",
  collapsed = false,
  onToggle
}: QuestionSheetProps) => {
  const questionsLeft = Math.max(0, questions.length - askedIds.length);
  const isCollapsed = collapsed;
  const [profileState, setProfileState] = useState<"closed" | "open" | "closing">("closed");
  const profileTimerRef = useRef<number | null>(null);
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const detailSeed = hashToHue(`${character.id}-${character.avatarSeed}`);
  const likes = pickFrom(LIKE_POOL, 3, detailSeed + 2);
  const dislikes = pickFrom(DISLIKE_POOL, 2, detailSeed + 6);
  const quirks = pickFrom(QUIRK_POOL, 2, detailSeed + 11);
  const hangout = pickFrom(HANGOUT_POOL, 1, detailSeed + 9)[0];
  const personality = Array.from(
    new Set([...character.tags, ...pickFrom(EXTRA_TRAITS, 2, detailSeed + 4)])
  ).slice(0, 5);
  const shortDescriptor = character.tags[0] ?? "New face";
  const observation = character.tags[1]
    ? `Moves like a ${character.tags[1]} rumor.`
    : "Moves like a quiet rumor.";
  const isProfileOpen = profileState === "open";
  const isProfileVisible = profileState !== "closed";

  useEffect(() => {
    if (isCollapsed && isProfileVisible) {
      if (profileTimerRef.current) {
        window.clearTimeout(profileTimerRef.current);
      }
      setProfileState("closed");
    }
  }, [isCollapsed, isProfileVisible]);

  useEffect(() => {
    return () => {
      if (profileTimerRef.current) {
        window.clearTimeout(profileTimerRef.current);
      }
    };
  }, []);

  const closeProfile = () => {
    if (profileTimerRef.current) {
      window.clearTimeout(profileTimerRef.current);
    }
    setProfileState("closing");
    profileTimerRef.current = window.setTimeout(() => {
      setProfileState("closed");
    }, 300);
  };

  const openProfile = () => {
    if (profileTimerRef.current) {
      window.clearTimeout(profileTimerRef.current);
    }
    setProfileState("open");
  };

  const handleProfileToggle = () => {
    if (isCollapsed && onToggle) {
      onToggle();
    }
    if (isProfileOpen) {
      closeProfile();
      return;
    }
    openProfile();
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative overflow-hidden rounded-t-[30px] border border-amber-200/70 bg-gradient-to-b from-amber-50/95 via-amber-50/90 to-white/90 px-4 pb-4 pt-4 shadow-[0_-12px_30px_rgba(15,23,42,0.18)] backdrop-blur transform-gpu will-change-[max-height,transform] motion-safe:transition-[max-height,transform] motion-safe:duration-300 motion-safe:ease-out ${
          isCollapsed
            ? "max-h-[78px] min-h-[78px] translate-y-2"
            : isProfileOpen
              ? "max-h-[82vh] min-h-[520px] translate-y-0"
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
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700/90 shadow-sm">
              Questions left: {questionsLeft}
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleProfileToggle();
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-200/70 bg-white/90 text-xs font-semibold text-amber-700/90 shadow-sm transition hover:-translate-y-[1px]"
              aria-label={isProfileOpen ? "Close date card" : "Open date card"}
            >
              i
            </button>
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
        {isProfileVisible ? (
          <div
            className={`relative mt-4 origin-top overflow-hidden transition-all duration-300 ease-out ${
              isProfileOpen
                ? "max-h-[80vh] scale-100 opacity-100"
                : "pointer-events-none max-h-0 scale-[0.98] opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={closeProfile}
              className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-slate-600 shadow transition hover:-translate-y-[1px]"
              aria-label="Close date card"
            >
              ×
            </button>
            <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[28px] border border-amber-200/70 bg-gradient-to-b from-amber-50/90 via-amber-50/85 to-white/80 shadow-[0_18px_36px_rgba(124,58,237,0.12)]">
              <div className="relative h-[32vh] min-h-[220px]">
                <div className="absolute inset-0" style={{ background: gradient }} />
                <Image
                  src={character.portraitSrc}
                  alt={`${character.name} portrait`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 520px, 560px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.06),rgba(15,23,42,0.35))] mix-blend-multiply opacity-80" />
                <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:3px_3px]" />
              </div>
              <div className="max-h-[42vh] overflow-y-auto px-5 pb-6 pt-4 text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-2xl font-semibold text-slate-800">
                    {character.name}, {character.age}
                  </div>
                  <StickerTag
                    label={shortDescriptor}
                    className="rotate-[-1deg] ring-2 ring-amber-200/70"
                  />
                </div>
                <div className="mt-2 text-sm text-slate-600">{observation}</div>
                <div className="mt-5 flex flex-col gap-5">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Signals
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {personality.map((tag) => (
                        <StickerTag
                          key={tag}
                          label={tag}
                          className={TRAIT_STYLES[hashToIndex(tag, TRAIT_STYLES.length)]}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Whispers
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Rumor says {quirks[0]} and a soft spot for {likes[0]}. Lingers near {hangout}.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Drawn to
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {likes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Avoids
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {dislikes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
