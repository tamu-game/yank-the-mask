"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const BackgroundAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setNeedsUnlock(false);
    } catch {
      setNeedsUnlock(true);
    }
  }, []);

  useEffect(() => {
    if (isMuted) return;
    void attemptPlay();
  }, [attemptPlay, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.pause();
      return;
    }
    if (audio.paused) {
      void attemptPlay();
    }
  }, [attemptPlay, isMuted]);

  useEffect(() => {
    if (!needsUnlock || isMuted) return;
    const unlock = () => {
      void attemptPlay();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [attemptPlay, isMuted, needsUnlock]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      setIsMuted((prev) => !prev);
      return;
    }
    if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
      void audio.play().catch(() => setNeedsUnlock(true));
      return;
    }
    setIsMuted(true);
    audio.muted = true;
    audio.pause();
  };

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-50">
      <button
        type="button"
        className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        onClick={handleToggle}
        aria-pressed={isMuted}
      >
        {needsUnlock && !isMuted ? "Sesi baslat" : isMuted ? "Sesi ac" : "Sesi kapat"}
      </button>
      <audio
        ref={audioRef}
        src="/music/cw.mid"
        preload="auto"
        loop
        autoPlay
        playsInline
        muted={isMuted}
      />
    </div>
  );
};
