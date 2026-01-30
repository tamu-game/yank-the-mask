"use client";

import type { CharacterPreview } from "@/types/game";
import { SpeechBubble } from "@/components/SpeechBubble";

type CafeSceneProps = {
  character: CharacterPreview;
  questionText?: string | null;
  answerText?: string | null;
  isTyping?: boolean;
  glitch?: boolean;
  isLoading?: boolean;
};

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

export const CafeScene = ({
  character,
  questionText,
  answerText,
  isTyping = false,
  glitch = false,
  isLoading = false
}: CafeSceneProps) => {
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const bubbleText =
    isTyping || isLoading
      ? "..."
      : answerText || "Ask me something sweet.";
  const noteText = questionText || "Pick a question from the menu!";

  return (
    <div className="relative h-[62vh] min-h-[480px] w-full overflow-hidden rounded-[32px] border-2 border-white/80 bg-white/70 p-4 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fff4e6_0%,#fdf2ff_55%,#fff7ed_100%)]" />
      <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-rose-200/50 blur-3xl" />
      <div className="absolute right-6 top-12 h-20 w-20 rotate-12 rounded-3xl border-2 border-rose-200/70 bg-white/70 shadow-sm" />
      <div className="absolute left-10 top-10 h-2 w-2 rounded-full bg-rose-400/70 animate-float" />
      <div className="absolute right-16 top-20 h-3 w-3 rounded-full bg-teal-300/70 animate-float-slow" />
      <div className="absolute left-20 top-24 h-1.5 w-1.5 rounded-full bg-purple-300/70 animate-float" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100/80 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="relative mt-4 flex flex-col items-center gap-2">
          <SpeechBubble
            text={bubbleText}
            isTyping={isTyping || isLoading}
            glitch={glitch && !isTyping && !isLoading}
            className="w-[220px] sm:w-[260px]"
          />
          <div className="rounded-[28px] border-2 border-white/80 bg-white/90 px-4 py-3 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <div
                  className="absolute inset-0 rounded-[40%_60%_55%_45%] shadow-inner"
                  style={{ background: gradient }}
                />
                <div className="absolute left-1/2 top-[44%] flex w-12 -translate-x-1/2 items-center justify-between">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-800/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-800/70" />
                </div>
                <div className="absolute left-1/2 top-[60%] h-2 w-6 -translate-x-1/2 rounded-full border-b-2 border-slate-800/60" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  {character.name}
                </div>
                <div className="text-xs text-slate-500">Across the table</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-1" />

        <div className="relative mb-8">
          <div className="absolute bottom-10 left-4 max-w-[65%] -rotate-2">
            <div className="note-card">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400">
                Your thought bubble
              </div>
              <div className="mt-2 text-sm text-slate-700">{noteText}</div>
            </div>
          </div>
          <div className="relative mx-auto w-[82%] max-w-sm">
            <div className="h-12 rounded-[999px] bg-amber-200/90 shadow-[inset_0_6px_12px_rgba(245,158,11,0.25)]" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className="relative h-12 w-12 rounded-full border-2 border-white/80 bg-white shadow-md">
                <div className="steam" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
