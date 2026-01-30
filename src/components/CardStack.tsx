"use client";

import { useMemo, useRef, useState } from "react";
import type { CharacterPreview } from "@/types/game";
import { ProfileCard } from "@/components/ProfileCard";
import { StickerTag } from "@/components/StickerTag";
import { Button } from "@/components/Button";

type CardStackProps = {
  characters: CharacterPreview[];
  onSwipeLeft: (character: CharacterPreview) => void;
  onSwipeRight: (character: CharacterPreview) => void;
};

const SWIPE_THRESHOLD = 120;
const STACK_DEPTH = 3;

export const CardStack = ({ characters, onSwipeLeft, onSwipeRight }: CardStackProps) => {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeOutDir, setSwipeOutDir] = useState<"left" | "right" | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const activeCard = characters[index];

  const stackedCards = useMemo(() => {
    return characters.slice(index, index + STACK_DEPTH);
  }, [characters, index]);

  const resetPosition = () => {
    setDragX(0);
    setDragY(0);
    setSwipeOutDir(null);
  };

  const advanceCard = (direction: "left" | "right") => {
    if (!activeCard) return;
    if (direction === "left") {
      onSwipeLeft(activeCard);
    } else {
      onSwipeRight(activeCard);
    }
    setIndex((prev) => prev + 1);
    resetPosition();
  };

  const triggerSwipe = (direction: "left" | "right") => {
    if (!activeCard || swipeOutDir) return;
    const offscreen = typeof window !== "undefined" ? window.innerWidth * 1.2 : 1000;
    setSwipeOutDir(direction);
    setDragX(direction === "right" ? offscreen : -offscreen);
    setDragY(-20);
    window.setTimeout(() => advanceCard(direction), 280);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!activeCard || swipeOutDir) return;
    setIsDragging(true);
    startRef.current = { x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging || !startRef.current) return;
    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;
    setDragX(dx);
    setDragY(dy);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      triggerSwipe(dragX > 0 ? "right" : "left");
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-rose-200 bg-white/70 p-10 text-center shadow-lg">
        <div className="text-lg font-semibold text-slate-700">No more vibes right now</div>
        <p className="text-sm text-slate-500">Refresh to reshuffle the cafe crowd.</p>
        <Button variant="secondary" onClick={() => setIndex(0)}>
          Shuffle again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[92%] sm:max-w-[520px] lg:max-w-[560px]">
      <div className="relative h-[78vh] min-h-[520px] max-h-[720px]">
        {[...stackedCards].reverse().map((card, reverseIndex) => {
          const position = stackedCards.length - 1 - reverseIndex;
          const depth = position;
          const isTop = depth === 0;
          const scale = 1 - depth * 0.04;
          const translateY = depth * 14;
          const opacity = 1 - depth * 0.25;
          const transitionClass = isTop
            ? isDragging
              ? ""
              : swipeOutDir
                ? "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            : "transition-all duration-300 ease-out";

          const style = isTop
            ? {
                transform: `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)`
              }
            : {
                transform: `translate(0px, ${translateY}px) scale(${scale})`
              };

          return (
            <div
              key={card.id}
              className={`absolute inset-0 ${transitionClass} ${
                isTop ? "pointer-events-auto touch-pan-y select-none" : "pointer-events-none"
              }`}
              style={{ ...style, opacity, zIndex: STACK_DEPTH - depth }}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerUp : undefined}
              onPointerCancel={isTop ? handlePointerUp : undefined}
            >
              <div className={isTop ? "" : "blur-[1px]"}>
                <ProfileCard character={card} />
              </div>
              {isTop ? (
                <>
                  <div
                    className="pointer-events-none absolute left-6 top-6"
                    style={{ opacity: matchOpacity }}
                  >
                    <StickerTag label="VIBE!" className="rotate-[-6deg]" />
                  </div>
                  <div
                    className="pointer-events-none absolute right-6 top-6"
                    style={{ opacity: nopeOpacity }}
                  >
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
