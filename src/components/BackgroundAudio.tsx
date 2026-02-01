"use client";

import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useSound } from "@/components/SoundProvider";

export const BackgroundAudio = () => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-50">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        onClick={toggleSound}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? "Sound on" : "Sound off"}
      >
        {soundEnabled ? (
          <FaVolumeUp className="text-base" />
        ) : (
          <FaVolumeMute className="text-base" />
        )}
      </button>
    </div>
  );
};
