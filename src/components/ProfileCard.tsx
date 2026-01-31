"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CharacterPreview } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const TRAIT_STYLES = [
  "rotate-[-2deg] shadow-md ring-2 ring-amber-200/70",
  "rotate-[1deg] shadow-sm ring-2 ring-sky-200/70",
  "rotate-[-1deg] shadow-sm ring-2 ring-rose-200/70",
  "rotate-[2deg] shadow-md ring-2 ring-emerald-200/70",
  "rotate-[-3deg] shadow-sm ring-2 ring-violet-200/70"
];

const hashToIndex = (value: string, modulo: number) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % modulo;
};

export const ProfileCard = ({ character }: { character: CharacterPreview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const likes = character.likes;
  const dislikes = character.dislikes;
  const quirks = character.quirks;
  const hangout = character.hangout;
  const personality = character.traits.slice(0, 5);
  const shortDescriptor = character.tags[0] ?? "New face";
  const observation = character.observation;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-white/80 bg-white/90 shadow-[0_22px_40px_rgba(124,58,237,0.18)] backdrop-blur-xl active:shadow-[0_26px_52px_rgba(94,234,212,0.22)] active:ring-2 active:ring-emerald-200/60">
      <div className="relative h-[74%] min-h-[360px] w-full">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <Image
          src={character.portraitSrc}
          alt={`${character.name} portrait`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 520px, 560px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent group-active:opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.06),rgba(15,23,42,0.35))] mix-blend-multiply opacity-80" />
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:3px_3px]" />
      </div>

      <div
        className={`flex ${
          isExpanded ? "flex-1 overflow-y-auto" : "h-[26%] overflow-hidden"
        } flex-col px-5 pb-6 pt-4 text-slate-700`}
        onWheel={(event) => {
          if (!isExpanded && event.deltaY < -6) {
            setIsExpanded(true);
          }
        }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }
        }}
        onTouchMove={(event) => {
          if (isExpanded) return;
          const touch = event.touches[0];
          const start = touchStartRef.current;
          if (!touch || !start) return;
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (dy < -12 && Math.abs(dy) > Math.abs(dx)) {
            setIsExpanded(true);
          }
        }}
      >
        <div className="min-h-full">
          <div className="flex items-center justify-between gap-3">
            <div className="text-2xl font-semibold text-slate-800">
              {character.name}, {character.age}
            </div>
            <StickerTag label={shortDescriptor} className="rotate-[-1deg] ring-2 ring-amber-200/70" />
          </div>
          <div className="mt-2 text-sm text-slate-600">{observation}</div>
          {!isExpanded ? (
            <div className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Swipe for more
            </div>
          ) : null}
        </div>

        <div
          className={`flex flex-col gap-5 pt-2 transition-all duration-300 ${
            isExpanded
              ? "max-h-[2000px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          } overflow-hidden`}
          aria-hidden={!isExpanded}
        >
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Signals
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {personality.map((tag) => (
                <StickerTag
                  key={tag}
                  label={tag}
                  className={TRAIT_STYLES[hashToIndex(tag, TRAIT_STYLES.length)]}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Whispers
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Rumor says {quirks[0]} and a soft spot for {likes[0]}. Lingers near {hangout}.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Drawn to
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {likes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Avoids
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {dislikes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Tells
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {quirks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
