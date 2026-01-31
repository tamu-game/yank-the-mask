"use client";

import { AnimatedSprite } from "@/components/cafe/AnimatedSprite";

type CharacterSpriteProps = {
  sources: string[];
  alt: string;
  className?: string;
  priority?: boolean;
  restartKey?: number;
};

export const CharacterSprite = ({
  sources,
  alt,
  className = "",
  priority = false,
  restartKey = 0
}: CharacterSpriteProps) => {
  return (
    <div className={`relative ${className}`}>
      <AnimatedSprite
        sources={sources}
        alt={alt}
        className=""
        restartKey={restartKey}
        priority={priority}
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 520px"
      />
    </div>
  );
};
