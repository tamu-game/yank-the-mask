"use client";

import { useEffect, useMemo, useState } from "react";

type TypingTextProps = {
  text: string;
  durationMs?: number;
  animate?: boolean;
  animateKey?: string | number | null;
  className?: string;
};

const DEFAULT_DURATION_MS = 700;

export const TypingText = ({
  text,
  durationMs = DEFAULT_DURATION_MS,
  animate = true,
  animateKey = null,
  className = ""
}: TypingTextProps) => {
  const characters = useMemo(() => Array.from(text), [text]);
  const [visibleCount, setVisibleCount] = useState(characters.length);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (!animate || prefersReducedMotion) {
      setVisibleCount(characters.length);
      return;
    }
    if (!characters.length) {
      setVisibleCount(0);
      return;
    }
    const total = characters.length;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const nextCount = Math.max(0, Math.floor(progress * total));
      setVisibleCount(nextCount);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    setVisibleCount(0);
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [animate, animateKey, characters, durationMs, prefersReducedMotion]);

  return <span className={className}>{characters.slice(0, visibleCount).join("")}</span>;
};
