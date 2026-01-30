"use client";

import type { CharacterPreview } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

export const ProfileCard = ({ character }: { character: CharacterPreview }) => {
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const tags = character.tags.slice(0, 4);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-white/80 bg-white/80 p-5 shadow-[0_22px_40px_rgba(124,58,237,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <StickerTag label="Swipe to vibe" className="-rotate-2" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400">
          Tap heart to meet!
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-24 w-24">
          <div
            className="absolute inset-0 rounded-[40%_60%_55%_45%] shadow-inner"
            style={{ background: gradient }}
          />
          <div className="absolute left-1/2 top-[44%] flex w-12 -translate-x-1/2 items-center justify-between">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800/70" />
          </div>
          <div className="absolute left-1/2 top-[60%] h-2 w-6 -translate-x-1/2 rounded-full border-b-2 border-slate-800/60" />
        </div>
        <div>
          <div className="text-2xl font-semibold text-slate-700">
            {character.name}, {character.age}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <StickerTag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex-1">
        <p className="line-clamp-3 text-sm text-slate-600">{character.bio}</p>
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Swipe to vibe
      </div>
    </div>
  );
};
