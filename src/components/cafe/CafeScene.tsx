"use client";

import Image from "next/image";
import Link from "next/link";
import type { CharacterPreview } from "@/types/game";
import { CharacterSprite } from "@/components/cafe/CharacterSprite";
import { SpeechBubble } from "@/components/cafe/SpeechBubble";

type CafeSceneProps = {
  character: CharacterPreview;
  questionText: string | null;
  answerText: string | null;
  answerKey?: string | null;
  portraitSources?: string[] | null;
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
  portraitSources = null,
  portraitOverrideAlt = null,
  isTyping,
  glitch,
  suspicion,
  className = "",
  onBack
}: CafeSceneProps) => {
  const showBubble = isTyping || Boolean(answerText);
  const portraitImageSources = portraitSources?.length
    ? portraitSources
    : [character.portraitSrc];
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
              className="relative z-40 rounded-full border-2 border-amber-200/70 bg-[#fff6e6]/90 px-3 py-1 text-xs font-semibold text-amber-900 shadow-[0_3px_0_rgba(197,139,79,0.2)] backdrop-blur transition hover:bg-[#fff0d6]"
            >
              ← Back
            </button>
          ) : (
            <Link
              href="/feed"
              className="relative z-40 rounded-full border-2 border-amber-200/70 bg-[#fff6e6]/90 px-3 py-1 text-xs font-semibold text-amber-900 shadow-[0_3px_0_rgba(197,139,79,0.2)] backdrop-blur"
            >
              ← Back
            </Link>
          )}
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-x-0 bottom-[40%] flex justify-center">
            <div className="relative h-[80vh] w-[108%] max-w-[880px]">
              <div className="absolute inset-x-0 bottom-[-35vh] z-0 h-[80vh] w-full">
                <Image
                  src="/backgrounds/chair.png"
                  alt="Chair"
                  fill
                  className="object-contain object-bottom"
                  sizes="100vw"
                />
              </div>
              <CharacterSprite
                sources={portraitImageSources}
                alt={portraitAlt}
                className="absolute inset-x-0 bottom-0 h-full w-full z-10"
                priority
              />
              {showBubble ? (
                <div className="absolute left-1/2 bottom-[calc(55%-40px)] sm:bottom-[calc(55%-120px)] lg:bottom-[calc(55%-160px)] z-20 w-[78%] max-w-[420px] -translate-x-1/2">
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
              <div className="animate-bubble-pop rounded-[18px] border-2 border-amber-200/80 bg-[#fff6e6]/95 px-4 py-3 text-sm text-amber-900 shadow-[0_10px_20px_rgba(197,139,79,0.18)] backdrop-blur">
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
