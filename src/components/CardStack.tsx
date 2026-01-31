"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CharacterPreview } from "@/types/game";
import { ProfileCard } from "@/components/ProfileCard";
import { StickerTag } from "@/components/StickerTag";
import { Button } from "@/components/Button";
import { playCardSwapSound, preloadCardSwapSound } from "@/lib/cardSwapSound";

type CardStackProps = {
  characters: CharacterPreview[];
  onSwipeLeft: (character: CharacterPreview) => void;
  onSwipeRight: (character: CharacterPreview) => void;
};

const STACK_DEPTH = 3;
const SLOP = 8;
const HORIZONTAL_LOCK_RATIO = 1.2;
const SWIPE_THRESHOLD = 120;

export const CardStack = ({ characters, onSwipeLeft, onSwipeRight }: CardStackProps) => {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeOutDir, setSwipeOutDir] = useState<"left" | "right" | null>(null);

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const gestureStateRef = useRef<"idle" | "maybe" | "dragging">("idle");
  const latestDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const capturedRef = useRef(false);

  const activeCard = characters[index];

  useEffect(() => {
    preloadCardSwapSound();
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const stackedCards = useMemo(() => {
    return characters.slice(index, index + STACK_DEPTH);
  }, [characters, index]);

  const resetDrag = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    latestDeltaRef.current = { x: 0, y: 0 };
    setDragX(0);
    setDragY(0);
    setSwipeOutDir(null);
  };

  const advanceCard = (direction: "left" | "right") => {
    if (!activeCard) return;

    if (direction === "left") onSwipeLeft(activeCard);
    else onSwipeRight(activeCard);

    setIndex((prev) => prev + 1);
    resetDrag();
  };

  const triggerSwipe = (direction: "left" | "right") => {
    if (!activeCard || swipeOutDir) return;

    playCardSwapSound();
    setIsDragging(false);

    const offscreen = typeof window !== "undefined" ? window.innerWidth * 1.2 : 1000;
    setSwipeOutDir(direction);
    setDragX(direction === "right" ? offscreen : -offscreen);
    setDragY(-20);

    window.setTimeout(() => advanceCard(direction), 280);
  };

  const scheduleDragUpdate = () => {
    if (rafRef.current !== null || typeof window === "undefined") return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setDragX(latestDeltaRef.current.x);
      setDragY(latestDeltaRef.current.y);
    });
  };

  const cancelGesture = () => {
    gestureStateRef.current = "idle";
    startRef.current = null;
    pointerIdRef.current = null;
    capturedRef.current = false;
    setIsDragging(false);
    setDragX(0);
    setDragY(0);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!activeCard || swipeOutDir) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target as HTMLElement;
    const isHandle = !!target.closest("[data-swipe-handle]");
    if (!isHandle) return;

    startRef.current = { x: event.clientX, y: event.clientY };
    pointerIdRef.current = event.pointerId;
    gestureStateRef.current = "maybe";
    capturedRef.current = false;
    latestDeltaRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (gestureStateRef.current === "idle") return;
    if (pointerIdRef.current !== event.pointerId) return;
    if (!startRef.current) return;

    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (gestureStateRef.current === "maybe") {
      if (absX < SLOP && absY < SLOP) return;

      if (absX > absY * HORIZONTAL_LOCK_RATIO) {
        gestureStateRef.current = "dragging";
        setIsDragging(true);
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        capturedRef.current = true;
      } else {
        cancelGesture();
        return;
      }
    }

    if (gestureStateRef.current !== "dragging") return;

    latestDeltaRef.current = { x: dx, y: dy };
    scheduleDragUpdate();

    if (capturedRef.current) {
      event.preventDefault();
    }
  };

  const handlePointerEnd = (event: React.PointerEvent) => {
    if (pointerIdRef.current !== event.pointerId) return;

    const wasDragging = gestureStateRef.current === "dragging";
    const start = startRef.current;
    const dx = start ? event.clientX - start.x : 0;

    gestureStateRef.current = "idle";
    startRef.current = null;
    pointerIdRef.current = null;

    if (capturedRef.current) {
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
      } catch {
        // ignore if capture was lost
      }
    }

    capturedRef.current = false;
    setIsDragging(false);

    if (wasDragging && Math.abs(dx) > SWIPE_THRESHOLD) {
      triggerSwipe(dx > 0 ? "right" : "left");
      return;
    }

    setDragX(0);
    setDragY(0);
  };

  const rotation = dragX / 18;
  const matchOpacity = Math.min(0.9, Math.max(0, dragX / 140));
  const nopeOpacity = Math.min(0.9, Math.max(0, -dragX / 140));

  if (!activeCard) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-amber-200 bg-[#fff6e6]/95 p-10 text-center shadow-[0_12px_26px_rgba(197,139,79,0.2)]">
        <div className="text-lg font-semibold text-amber-900">No more dates right now</div>
        <p className="text-sm text-amber-700/80">Refresh to reshuffle the cafe crowd.</p>
        <Button variant="secondary" onClick={() => setIndex(0)}>
          Shuffle again
        </Button>
      </div>
    );
  }

  return (
    <div
      className="
        relative w-full
        max-w-full sm:max-w-[520px] lg:max-w-[560px]
        h-[min(78dvh,720px)]
        min-h-[520px]
      "
    >
      <div className="relative h-full">
        {[...stackedCards].reverse().map((card, reverseIndex) => {
          const position = stackedCards.length - 1 - reverseIndex;
          const depth = position;
          const isTop = depth === 0;
          const scale = 1;
          const translateY = 1;
          const opacity = 1;
          const transitionClass = isTop
            ? isDragging
              ? ""
              : swipeOutDir
                ? "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            : "transition-all duration-300 ease-out";

          const style = isTop
            ? { transform: `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)` }
            : { transform: `translate(0px, ${translateY}px) scale(${scale})` };

          return (
            <div
              key={card.id}
              className={`absolute inset-0 ${transitionClass} ${isTop ? "pointer-events-auto" : "pointer-events-none"}`}
              style={{ ...style, opacity, zIndex: STACK_DEPTH - depth }}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerEnd : undefined}
              onPointerCancel={isTop ? handlePointerEnd : undefined}
            >
              <div className={isTop ? "" : "blur-[1px]"}>
                <ProfileCard character={card} />
              </div>

              {isTop ? (
                <>
                  <div className="pointer-events-none absolute left-6 top-6" style={{ opacity: matchOpacity }}>
                    <StickerTag label="VIBE!" className="rotate-[-6deg]" />
                  </div>
                  <div className="pointer-events-none absolute right-6 top-6" style={{ opacity: nopeOpacity }}>
                    <StickerTag label="NOPE!" className="rotate-[6deg]" />
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
