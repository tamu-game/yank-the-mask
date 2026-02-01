"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const MUSIC_VOLUME = 0.25;

export const BackgroundAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const hasHydratedRef = useRef(false);
  const soundEnabledRef = useRef(soundEnabled);
  const hasUserInteractedRef = useRef(hasUserInteracted);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    hasUserInteractedRef.current = hasUserInteracted;
  }, [hasUserInteracted]);

  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;
    try {
      const stored = window.localStorage.getItem("maskle_sound_enabled");
      if (stored === "false") {
        setSoundEnabled(false);
        return;
      }
      if (stored === "true") {
        setSoundEnabled(true);
        return;
      }
    } catch {
      // ignore storage access issues
    }
    setSoundEnabled(false);
  }, []);

  const startAudioIfAllowed = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = MUSIC_VOLUME;
    void audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = MUSIC_VOLUME;
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    const nextEnabled = !soundEnabled;
    setSoundEnabled(nextEnabled);
    if (!audio) return;
    if (!nextEnabled) {
      audio.muted = true;
      audio.pause();
      return;
    }
    if (hasUserInteractedRef.current) {
      startAudioIfAllowed();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!soundEnabled) {
      audio.muted = true;
      audio.pause();
      return;
    }
    if (!hasUserInteracted) {
      audio.muted = true;
      return;
    }
    audio.muted = false;
    if (audio.paused) {
      void audio.play().catch(() => {});
    }
  }, [hasUserInteracted, soundEnabled]);

  useEffect(() => {
    const handleFirstGesture = () => {
      if (hasUserInteractedRef.current) return;
      hasUserInteractedRef.current = true;
      setHasUserInteracted(true);
      const audio = audioRef.current;
      if (!audio) return;
      if (soundEnabledRef.current) {
        startAudioIfAllowed();
      } else {
        audio.muted = true;
        audio.pause();
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    try {
      window.localStorage.setItem("maskle_sound_enabled", soundEnabled ? "true" : "false");
    } catch {
      // ignore storage access issues
    }
  }, [soundEnabled]);

  const isAudible = soundEnabled && hasUserInteracted;

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-50">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        onClick={handleToggle}
        aria-pressed={isAudible}
        aria-label={isAudible ? "Sound on" : "Sound off"}
      >
        {isAudible ? (
          <FaVolumeUp className="text-base" />
        ) : (
          <FaVolumeMute className="text-base" />
        )}
      </button>
      <audio
        ref={audioRef}
        src="/music/cw.mp3"
        preload="auto"
        loop
        autoPlay
        playsInline
        muted={!soundEnabled || !hasUserInteracted}
      />
    </div>
  );
};
