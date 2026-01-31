"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

type FallbackImageProps = Omit<ImageProps, "src"> & {
  sources: string[];
};

export const FallbackImage = ({ sources, onError, ...props }: FallbackImageProps) => {
  const normalizedSources = useMemo(() => sources.filter(Boolean), [sources]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [normalizedSources.join("|")]);

  if (!normalizedSources.length) {
    return null;
  }

  const src = normalizedSources[Math.min(index, normalizedSources.length - 1)];

  return (
    <Image
      {...props}
      key={src}
      src={src}
      onError={(event) => {
        if (index < normalizedSources.length - 1) {
          setIndex(index + 1);
        }
        onError?.(event);
      }}
    />
  );
};
