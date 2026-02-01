"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const SOUND_STORAGE_KEY = "maskle_sound_enabled";
const MUSIC_VOLUME = 0.25;

type SoundContextValue = {
  soundEnabled: boolean;
  hasUserInteracted: boolean;
  isAudible: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
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
      const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
      if (stored === "true") {
        setSoundEnabled(true);
        return;
      }
      if (stored === "false") {
        setSoundEnabled(false);
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

  const applyAudioState = useCallback(
    (enabled: boolean, interacted: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (!enabled) {
        audio.muted = true;
        audio.pause();
        return;
      }
      if (!interacted) {
        audio.muted = true;
        return;
      }
      audio.muted = false;
      if (audio.paused) {
        void audio.play().catch(() => {});
      }
    },
    []
  );

  useEffect(() => {
    applyAudioState(soundEnabled, hasUserInteracted);
  }, [applyAudioState, hasUserInteracted, soundEnabled]);

  const toggleSound = useCallback(() => {
    const nextEnabled = !soundEnabledRef.current;
    setSoundEnabled(nextEnabled);
    const audio = audioRef.current;
    if (!audio) return;
    if (!nextEnabled) {
      audio.muted = true;
      audio.pause();
      return;
    }
    if (hasUserInteractedRef.current) {
      startAudioIfAllowed();
    }
  }, [startAudioIfAllowed]);

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
  }, [startAudioIfAllowed]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? "true" : "false");
    } catch {
      // ignore storage access issues
    }
  }, [soundEnabled]);

  const isAudible = soundEnabled && hasUserInteracted;

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        hasUserInteracted,
        isAudible,
        toggleSound
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src="/music/cw.mp3"
        preload="auto"
        loop
        autoPlay
        playsInline
        muted={!soundEnabled || !hasUserInteracted}
      />
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
};
