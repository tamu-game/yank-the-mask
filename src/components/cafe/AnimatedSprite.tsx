"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FallbackImage } from "@/components/FallbackImage";
import { getGifObjectUrl } from "@/lib/gifBlobCache";

const DEFAULT_SIZES = "(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 520px";
const BASE_SPRITE_CLASSES =
  "object-contain object-bottom scale-[0.8] origin-bottom -translate-y-10";

type AnimatedSpriteProps = {
  sources: string[];
  alt: string;
  className?: string;
  restartKey?: number;
  priority?: boolean;
  sizes?: string;
};

export const AnimatedSprite = ({
  sources,
  alt,
  className = "",
  restartKey = 0,
  priority = false,
  sizes
}: AnimatedSpriteProps) => {
  const normalizedSources = useMemo(() => sources.filter(Boolean), [sources]);
  const sourcesKey = normalizedSources.join("|");
  const [index, setIndex] = useState(0);
  const [layerSources, setLayerSources] = useState<[string | null, string | null]>([
    null,
    null
  ]);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const activeLayerRef = useRef<0 | 1>(0);
  const pendingLayerRef = useRef<0 | 1 | null>(null);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    setIndex(0);
    setLayerSources([null, null]);
    setActiveLayer(0);
    pendingLayerRef.current = null;
  }, [sourcesKey]);

  const currentIndex = Math.min(index, normalizedSources.length - 1);
  const selectedSrc = normalizedSources[currentIndex] ?? null;
  const isGif = Boolean(selectedSrc) && selectedSrc.toLowerCase().endsWith(".gif");

  useEffect(() => {
    if (!selectedSrc || !isGif) {
      pendingLayerRef.current = null;
      setLayerSources([null, null]);
      setActiveLayer(0);
      return;
    }

    let isCancelled = false;
    const loadLayer: 0 | 1 = activeLayerRef.current === 0 ? 1 : 0;
    pendingLayerRef.current = loadLayer;

    void getGifObjectUrl(selectedSrc!)
      .then((blobUrl) => {
        if (isCancelled) return;
        setLayerSources((prev) => {
          const next = [...prev] as [string | null, string | null];
          next[loadLayer] = blobUrl;
          return next;
        });
      })
      .catch(() => {
        if (isCancelled) return;
        setIndex((prev) =>
          Math.min(prev < normalizedSources.length - 1 ? prev + 1 : prev, normalizedSources.length - 1)
        );
      });

    return () => {
      isCancelled = true;
    };
  }, [isGif, selectedSrc, restartKey, normalizedSources.length]);

  if (!selectedSrc) {
    return null;
  }

  const handleGifLoad = async (layer: 0 | 1, img: HTMLImageElement | null) => {
    if (!img) return;
    if (pendingLayerRef.current !== layer) return;
    try {
      await img.decode?.();
    } catch {
      // Ignore decode errors; still swap once loaded.
    }
    pendingLayerRef.current = null;
    setActiveLayer(layer);
    setLayerSources((prev) => {
      const next = [...prev] as [string | null, string | null];
      next[1 - layer] = null;
      return next;
    });
  };

  const handleGifError = (layer: 0 | 1) => {
    if (pendingLayerRef.current !== layer) return;
    pendingLayerRef.current = null;
    setLayerSources((prev) => {
      const next = [...prev] as [string | null, string | null];
      next[layer] = null;
      return next;
    });
    setIndex((prev) =>
      Math.min(prev < normalizedSources.length - 1 ? prev + 1 : prev, normalizedSources.length - 1)
    );
  };

  const containerClassName = ["relative w-full h-full", className].filter(Boolean).join(" ");
  const layerClassName = (layer: 0 | 1) =>
    [
      `${BASE_SPRITE_CLASSES} transition-opacity duration-150 ease-out absolute inset-0 w-full h-full`,
      layer === activeLayer ? "opacity-100" : "opacity-0"
    ]
      .filter(Boolean)
      .join(" ");

  const gifLayer = layerSources.map((src, layer) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={`${src}:${restartKey}:${layer}`}
        src={src}
        alt={alt}
        className={layerClassName(layer as 0 | 1)}
        loading={priority ? "eager" : "lazy"}
        onLoad={(event) => handleGifLoad(layer as 0 | 1, event.currentTarget)}
        onError={() => handleGifError(layer as 0 | 1)}
      />
    ) : null
  );

  if (isGif) {
    return <div className={containerClassName}>{gifLayer}</div>;
  }

  const spriteClassName = BASE_SPRITE_CLASSES;

  return (
    <div className={containerClassName}>
      <FallbackImage
        key={`${selectedSrc}:${restartKey}`}
        sources={normalizedSources}
        alt={alt}
        priority={priority}
        fill
        sizes={sizes ?? DEFAULT_SIZES}
        className={spriteClassName}
      />
    </div>
  );
};
