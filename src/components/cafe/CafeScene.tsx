"use client";

import Image from "next/image";
import Link from "next/link";
import type { CharacterPreview } from "@/types/game";
import { gameConfig } from "@/lib/config";
import { CharacterSprite } from "@/components/cafe/CharacterSprite";
import { SpeechBubble } from "@/components/cafe/SpeechBubble";

type CafeSceneProps = {
  character: CharacterPreview;
  questionText: string | null;
  answerText: string | null;
  answerKey?: string | null;
  portraitOverrideSrc?: string | null;
  portraitOverrideAlt?: string | null;
  isTyping: boolean;
  glitch: boolean;
  suspicion: number;
  className?: string;
  onBack?: () => void;
};

export const CafeScene = ({
  character,
  questionText,
  answerText,
  answerKey = null,
  portraitOverrideSrc = null,
  portraitOverrideAlt = null,
  isTyping,
  glitch,
  suspicion,
  className = "",
  onBack
}: CafeSceneProps) => {
  const segments = 5;
  const clamped = Math.max(0, Math.min(gameConfig.suspicionClamp.max, suspicion));
  const filled = Math.round((clamped / gameConfig.suspicionClamp.max) * segments);
  const showBubble = isTyping || Boolean(answerText);
  const portraitSrc = portraitOverrideSrc ?? character.portraitSrc;
  const portraitAlt = portraitOverrideAlt ?? character.name;

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#f6efe6] ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/cafe.png"
          alt="Cafe background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.7),rgba(255,255,255,0.15)_45%,rgba(0,0,0,0.25)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-amber-200/80 via-amber-100/40 to-transparent" />
      <div className="pointer-events-none absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-white/70 opacity-60 animate-subtle-float" />
      <div className="pointer-events-none absolute right-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-amber-100/70 opacity-70 animate-subtle-float" />
      <div className="pointer-events-none absolute left-[24%] top-[32%] h-1 w-1 rounded-full bg-white/80 opacity-70 animate-subtle-float" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="relative z-40 pointer-events-auto flex items-center justify-between px-4 pt-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="relative z-40 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur transition hover:bg-black/45"
            >
              ← Back
            </button>
          ) : (
            <Link
              href="/feed"
              className="relative z-40 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur"
            >
              ← Back
            </Link>
          )}
          <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span>Vibe</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: segments }).map((_, index) => {
                const isActive = index < filled;
                return (
                  <svg
                    key={`vibe-${index}`}
                    className={`h-3.5 w-3.5 ${
                      isActive ? "text-rose-300" : "text-white/30"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 0.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-x-0 bottom-[40%] flex justify-center">
            <div className="relative h-[80vh] w-[108%] max-w-[880px]">
              <CharacterSprite
                src={portraitSrc}
                alt={portraitAlt}
                className="absolute inset-x-0 bottom-0 h-full w-full z-10"
                priority
              />
              {showBubble ? (
                <div className="absolute left-1/2 bottom-[calc(55%+8px)] z-20 w-[78%] max-w-[420px] -translate-x-1/2">
                  <SpeechBubble
                    text={answerText ?? ""}
                    isTyping={isTyping}
                    glitch={glitch}
                    animateKey={answerKey}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 w-full">
            <Image
              src="/backgrounds/table.png"
              alt="Cafe table"
              width={2048}
              height={4096}
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>

          {questionText ? (
            <div className="absolute bottom-[60%] left-4 max-w-[70%] sm:bottom-[50%] sm:left-10">
              <div className="animate-bubble-pop rounded-[18px] border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700/70">
                  Your note
                </div>
                <div className="mt-1 leading-relaxed">{questionText}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
