"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

type FallbackImageProps = Omit<ImageProps, "src" | "alt"> & {
  sources: string[];
  alt: string;
};

export const FallbackImage = ({ sources, onError, alt, ...props }: FallbackImageProps) => {
  const normalizedSources = useMemo(() => sources.filter(Boolean), [sources]);
  const sourcesKey = normalizedSources.join("|");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourcesKey]);

  if (!normalizedSources.length) {
    return null;
  }

  const src = normalizedSources[Math.min(index, normalizedSources.length - 1)];
  const isAnimated = src.toLowerCase().endsWith(".gif");

  return (
    <Image
      {...props}
      key={src}
      src={src}
      alt={alt}
      unoptimized={isAnimated}
      onError={(event) => {
        setIndex((prev) =>
          prev < normalizedSources.length - 1 ? prev + 1 : prev
        );
        onError?.(event);
      }}
    />
  );
};
