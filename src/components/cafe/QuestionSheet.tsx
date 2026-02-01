"use client";

import { FallbackImage } from "@/components/FallbackImage";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { CharacterPreview, QuestionPublic } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";
import { getProfilePortraitSources } from "@/lib/characterAssets";

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};



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
  maxQuestions: number;
  pendingId?: string | null;
  onAsk: (questionId: string) => void;
  disabled?: boolean;
  footer?: ReactNode;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
};

export const QuestionSheet = ({
  character,
  questions,
  askedIds,
  maxQuestions,
  pendingId,
  onAsk,
  disabled,
  footer,
  className = "",
  collapsed = false,
  onToggle
}: QuestionSheetProps) => {
  const questionsLeft = Math.max(0, maxQuestions - askedIds.length);
  const isCollapsed = collapsed;
  const [profileState, setProfileState] = useState<"closed" | "open" | "closing">("closed");
  const profileTimerRef = useRef<number | null>(null);
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const likes = character.likes;
  const dislikes = character.dislikes;
  const quirks = character.quirks;
  const personality = Array.from(new Set([...character.tags, ...character.traits]));
  const observation = character.observation;
  const bio = character.bio;
  const portraitSources = getProfilePortraitSources(character.id);
  const whispers = character.whispers;
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
          className={`relative overflow-hidden rounded-t-[30px] border-2 border-amber-200/80 bg-gradient-to-b from-[#fff4de]/95 via-[#fff0d6]/92 to-[#fff7ea]/90 px-4 pb-6 pt-4 shadow-[0_-12px_30px_rgba(197,139,79,0.22)] backdrop-blur transform-gpu will-change-[max-height,transform] motion-safe:transition-[max-height,transform] motion-safe:duration-300 motion-safe:ease-out ${
          isCollapsed
            ? "max-h-[78px] min-h-[78px] translate-y-2"
            : isProfileOpen
              ? "max-h-[82vh] min-h-[520px] translate-y-0"
              : "max-h-[42vh] min-h-[250px] translate-y-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-6 top-3 h-12 w-12 rounded-full bg-rose-200/30 blur-2xl" />
          <div className="absolute right-6 top-6 h-10 w-10 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="absolute bottom-10 left-10 h-10 w-10 rounded-full bg-white/40 blur-xl" />
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (!onToggle) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle();
            }
          }}
          className="relative mx-auto h-1.5 w-12 rounded-full bg-amber-300/90 cursor-pointer"
          aria-label="Toggle menu"
        />
        <div className="relative mt-3 flex w-full items-center justify-between gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(event) => {
              if (!onToggle) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle();
              }
            }}
            className="flex flex-1 items-center gap-2 text-left cursor-pointer"
            aria-expanded={!isCollapsed}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm">
              🍵
            </span>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800/80">
              Menu
            </div>
            <div className="rounded-full bg-[#fff7ea]/95 px-3 py-1 text-xs font-semibold text-amber-900 shadow-[0_3px_0_rgba(197,139,79,0.18)]">
              Questions left: {questionsLeft}
            </div>
          </div>
          <button
            type="button"
            onClick={handleProfileToggle}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-amber-200/80 bg-[#fff7ea]/95 text-xs font-semibold text-amber-800 shadow-[0_3px_0_rgba(197,139,79,0.18)] transition hover:-translate-y-[1px]"
            aria-label={isProfileOpen ? "Close date card" : "Open date card"}
          >
            {isProfileOpen ? "×" : "i"}
          </button>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative mt-2 w-full rounded-full border-2 border-amber-200/80 bg-[#fff7ea]/95 px-3 py-1 text-xs font-semibold text-amber-800/80 shadow-[0_3px_0_rgba(197,139,79,0.18)] transition ${
            isCollapsed ? "hover:-translate-y-[1px]" : "hidden"
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
            <div className="mx-auto w-full max-w-[520px]">
              <div className="max-h-[52vh] overflow-y-auto px-2 pb-6 pt-2 text-amber-900 sm:px-4 sm:pt-4">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 rounded-full">
                      <div className="absolute inset-0 rounded-full" style={{ background: gradient }} />
                      <div className="absolute inset-[2px] overflow-hidden rounded-full border-2 border-white/90 bg-white shadow-md">
                        <FallbackImage
                          sources={portraitSources}
                          alt={`${character.name} portrait`}
                          fill
                          sizes="48px"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 text-amber-950">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-lg font-semibold">{character.name}</div>
                      </div>
                      <div className="mt-1 text-sm text-amber-800/90">{observation}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                      About
                    </div>
                    <p className="mt-2 text-sm text-amber-800/90">{bio}</p>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
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
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                      Whispers
                    </div>
                    <p className="mt-2 text-sm text-amber-800/90">{whispers}</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                        Drawn to
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800/90">
                        {likes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                        Avoids
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800/90">
                        {dislikes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                      Quirks
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800/90">
                      {quirks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div
          className={`relative mt-0 space-y-2 overflow-y-auto pr-1 transform-gpu will-change-[max-height,opacity,transform] motion-safe:transition-[max-height,opacity,transform] motion-safe:duration-250 motion-safe:ease-out ${
            isCollapsed
              ? "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
              : "max-h-[20vh] sm:max-h-[24vh] opacity-100 translate-y-0"
          }`}
        >
            {questions.map((question) => {
              const isAsked = askedIds.includes(question.id);
              const isPending = pendingId === question.id;
              const isDisabled = disabled || isAsked || Boolean(pendingId);
              const surfaceClasses = isAsked
                ? "border-amber-200/80 bg-gradient-to-b from-[#fff4de]/90 via-[#fff7ea]/95 to-[#fff0d6]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(197,139,79,0.12)]"
                : "border-amber-200/90 bg-gradient-to-b from-[#fffaf1]/95 via-[#fff1db]/92 to-[#ffe6c6]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(197,139,79,0.16)]";
              const stateClasses = isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer";
              const interactiveClasses = !isDisabled
                ? "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-[1px] motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.98] hover:border-amber-200/80"
                : "";

              return (
                <button
                  key={question.id}
                  type="button"
                  className={`group relative w-full rounded-[22px] border px-4 py-3.5 text-left text-[15px] font-medium tracking-[0.01em] text-amber-900 ${surfaceClasses} ${stateClasses} ${interactiveClasses}`}
                  onClick={() => onAsk(question.id)}
                  disabled={isDisabled}
                >
                  <span className={`${isAsked ? "line-through text-amber-700/70" : ""}`}>
                    {isPending ? "Brewing..." : question.prompt}
                  </span>
                  {isAsked ? (
                    <span className="absolute right-2 top-2 rotate-6 rounded-full border border-rose-300/80 bg-rose-100/95 px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-rose-600/90 shadow-[0_2px_6px_rgba(214,94,107,0.18)]">
                      ASKED
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
        {footer ? <div className="relative mt-4">{footer}</div> : null}
      </div>
    </div>
  );
};
