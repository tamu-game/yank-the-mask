"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { BackgroundAudio } from "@/components/BackgroundAudio";
import { playButtonClickSound, preloadButtonClickSound } from "@/lib/buttonClickSound";

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const AppShell = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    preloadButtonClickSound();

    // ✅ passive + capture: scroll/swipe davranışını bozmaz
    const handlePointerDown = () => {
      playButtonClickSound();
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true, passive: true } as any);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, { capture: true } as any);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden text-slate-900">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-amber-200/60 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-rose-200/50 blur-[140px]" />
        <div className="absolute left-10 top-20 h-12 w-12 rotate-12 rounded-2xl border-2 border-amber-200/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute right-16 top-32 h-14 w-14 -rotate-6 rounded-full border-2 border-amber-200/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute bottom-24 left-10 h-10 w-10 rounded-full border-2 border-rose-200/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute left-1/3 top-10 h-8 w-8 -rotate-12 rounded-full border-2 border-amber-100/80 bg-white/80 shadow-[0_2px_0_rgba(197,139,79,0.18)]" />
        <div className="absolute right-10 top-1/4 h-16 w-16 rotate-6 rounded-3xl border-2 border-rose-100/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute left-6 bottom-1/3 h-14 w-14 -rotate-12 rounded-2xl border-2 border-amber-100/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute right-1/4 bottom-20 h-9 w-9 rotate-12 rounded-full border-2 border-rose-100/80 bg-white/80 shadow-[0_2px_0_rgba(197,139,79,0.18)]" />
        <div className="absolute left-1/2 bottom-12 h-12 w-12 -rotate-6 rounded-3xl border-2 border-amber-200/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
        <div className="absolute right-6 bottom-1/3 h-7 w-7 rotate-6 rounded-full border-2 border-amber-100/80 bg-white/80 shadow-[0_2px_0_rgba(197,139,79,0.18)]" />
        <div className="absolute left-20 top-1/2 h-10 w-10 rotate-3 rounded-2xl border-2 border-rose-100/80 bg-white/70 shadow-[0_3px_0_rgba(197,139,79,0.2)]" />
      </div>

      {/* ✅ Frame container */}
      <div className="absolute inset-0">
        <div
          className="
            relative
            w-full
            h-full
            min-h-0
            flex flex-col
            overflow-x-hidden overflow-y-auto
            overscroll-contain
            touch-pan-y
            [webkit-overflow-scrolling:touch]
          "
          data-game-root
          style={{
            // ✅ iOS safe area için (özellikle notch)
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <BackgroundAudio />
          {children}
        </div>
      </div>
    </div>
  );
};
