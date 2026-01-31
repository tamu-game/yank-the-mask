"use client";

import type { CharacterPreview } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";
import { FallbackImage } from "@/components/FallbackImage";
import { getProfilePortraitSources } from "@/lib/characterAssets";

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
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;

  const likes = character.likes ?? [];
  const dislikes = character.dislikes ?? [];
  const quirks = character.quirks ?? [];
  const hangout = character.hangout ?? "the cafe";
  const personality = [...(character.traits ?? []), ...(character.tags ?? [])];
  const shortDescriptor = character.tags?.[0] ?? "New face";
  const observation = character.observation ?? "";
  const portraitSources = getProfilePortraitSources(character.id);

  return (
    <div
      className="
        group flex h-full min-h-0 flex-col overflow-hidden
        rounded-[32px] border-2 border-white/80 bg-white/90
        shadow-[0_22px_40px_rgba(124,58,237,0.18)] backdrop-blur-xl
        active:shadow-[0_26px_52px_rgba(94,234,212,0.22)]
        active:ring-2 active:ring-emerald-200/60
      "
    >
      <div
        data-swipe-handle
        className="relative h-[clamp(240px,42vh,360px)] w-full shrink-0 touch-none select-none"
      >
        <div className="absolute inset-0" style={{ background: gradient }} />
        <FallbackImage
          sources={portraitSources}
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
        data-scroll-area
        className="
          min-h-0 flex-1 overflow-y-auto touch-pan-y
          px-5 pb-6 pt-4 text-slate-700
          [webkit-overflow-scrolling:touch]
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-semibold text-slate-800">
            {character.name}, {character.age}
          </div>
          <StickerTag label={shortDescriptor} className="rotate-[-1deg] ring-2 ring-amber-200/70" />
        </div>
        <div className="mt-2 text-sm text-slate-600">{observation}</div>

        <div className="flex flex-col gap-5 pt-4">
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
              Rumor says {quirks[0] ?? "they keep a secret list"} and a soft spot for{" "}
              {likes[0] ?? "quiet moments"}. Lingers near {hangout}.
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