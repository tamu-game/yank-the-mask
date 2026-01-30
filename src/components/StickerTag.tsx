"use client";

type StickerTagProps = {
  label: string;
  className?: string;
};

const palettes = [
  "bg-rose-100 text-rose-700 ring-rose-200/70",
  "bg-amber-100 text-amber-700 ring-amber-200/70",
  "bg-teal-100 text-teal-700 ring-teal-200/70",
  "bg-purple-100 text-purple-700 ring-purple-200/70",
  "bg-sky-100 text-sky-700 ring-sky-200/70"
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
