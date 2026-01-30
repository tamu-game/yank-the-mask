"use client";

import Image from "next/image";
import type { CharacterPreview } from "@/types/game";
import { StickerTag } from "@/components/StickerTag";

const hashToHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const pickFrom = (pool: string[], count: number, seed: number) => {
  const picks: string[] = [];
  for (let i = 0; i < pool.length && picks.length < count; i += 1) {
    const item = pool[(seed + i * 7) % pool.length];
    if (!picks.includes(item)) {
      picks.push(item);
    }
  }
  return picks;
};

const EXTRA_TRAITS = [
  "warm",
  "clever",
  "independent",
  "romantic",
  "grounded",
  "bold",
  "dreamy",
  "thoughtful"
];

const LIKE_POOL = [
  "late-night cafes",
  "street food",
  "rainy walks",
  "cozy bookstores",
  "sunrise hikes",
  "vinyl playlists",
  "board game nights",
  "spicy noodles",
  "museum dates",
  "night drives",
  "polaroid photos"
];

const DISLIKE_POOL = [
  "ghosting",
  "cold coffee",
  "awkward silences",
  "spoilers",
  "rush-hour crowds",
  "flaky plans",
  "loud chewing",
  "dull small talk"
];

const QUIRK_POOL = [
  "collects matchbooks from cafes",
  "sends voice notes instead of texts",
  "names every plant in sight",
  "always orders dessert first",
  "keeps a lucky charm in their pocket",
  "makes playlists for friends",
  "writes tiny notes in the margins of books"
];

const HANGOUT_POOL = [
  "the corner booth",
  "a rooftop garden",
  "the record shop",
  "the midnight diner",
  "the art museum cafe"
];

export const ProfileCard = ({ character }: { character: CharacterPreview }) => {
  const hue = hashToHue(character.avatarSeed);
  const gradient = `linear-gradient(135deg, hsl(${hue} 85% 75%), hsl(${(hue + 60) % 360} 85% 65%))`;
  const detailSeed = hashToHue(`${character.id}-${character.avatarSeed}`);
  const likes = pickFrom(LIKE_POOL, 3, detailSeed + 2);
  const dislikes = pickFrom(DISLIKE_POOL, 2, detailSeed + 6);
  const quirks = pickFrom(QUIRK_POOL, 2, detailSeed + 11);
  const hangout = pickFrom(HANGOUT_POOL, 1, detailSeed + 9)[0];
  const personality = Array.from(
    new Set([...character.tags, ...pickFrom(EXTRA_TRAITS, 2, detailSeed + 4)])
  ).slice(0, 5);

  return (
    <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto rounded-[32px] border-2 border-white/80 bg-white/90 shadow-[0_22px_40px_rgba(124,58,237,0.18)] backdrop-blur-xl">
      <div className="relative h-[62%] min-h-[320px] w-full">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <Image
          src={character.portraitSrc}
          alt={`${character.name} portrait`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 520px, 560px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-3">
          <StickerTag label="Swipe to vibe" className="-rotate-2 shadow-lg" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Tap heart to meet!
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="text-3xl font-semibold drop-shadow">
            {character.name}, {character.age}
          </div>
          <div className="mt-2 text-sm text-white/80">
            {character.bio}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 pb-7 pt-6 text-slate-700">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Personality traits
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {personality.map((tag) => (
              <StickerTag key={tag} label={tag} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Background
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Known for {quirks[0]} and a soft spot for {likes[0]}. Usually spotted around{" "}
            {hangout}.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Likes
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {likes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Dislikes
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
            Quirks & habits
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {quirks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          Scroll for more
        </div>
      </div>
    </div>
  );
};
