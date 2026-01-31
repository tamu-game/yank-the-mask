"use client";

type StickerTagProps = {
  label: string;
  className?: string;
};

const palettes = [
  "bg-rose-100 text-rose-700 ring-rose-200/80",
  "bg-amber-100 text-amber-800 ring-amber-200/80",
  "bg-lime-100 text-lime-800 ring-lime-200/80",
  "bg-orange-100 text-orange-800 ring-orange-200/80",
  "bg-yellow-100 text-yellow-800 ring-yellow-200/80"
];

const hashToIndex = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % palettes.length;
};

export const StickerTag = ({ label, className = "" }: StickerTagProps) => {
  const palette = palettes[hashToIndex(label)];
  return (
    <span className={`sticker-tag ${palette} ${className}`}>
      {label}
    </span>
  );
};
