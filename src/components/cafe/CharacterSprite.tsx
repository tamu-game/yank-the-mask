"use client";

import Image from "next/image";

type CharacterSpriteProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export const CharacterSprite = ({
  src,
  alt,
  className = "",
  priority = false
}: CharacterSpriteProps) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 520px"
        className="object-contain object-bottom scale-[0.8] origin-bottom -translate-y-10"
      />
    </div>
  );
};
