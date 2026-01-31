const gifBlobCache = new Map<string, Promise<string>>();

const createObjectUrl = async (src: string): Promise<string> => {
  const response = await fetch(src, { cache: "force-cache", mode: "cors" });
  if (!response.ok) {
    throw new Error("Failed to fetch GIF.");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const getGifObjectUrl = (src: string): Promise<string> => {
  if (gifBlobCache.has(src)) {
    return gifBlobCache.get(src)!;
  }
  const promise = createObjectUrl(src).catch((error) => {
    gifBlobCache.delete(src);
    throw error;
  });
  gifBlobCache.set(src, promise);
  return promise;
};

export const primeGifObjectUrl = (srcs: string[]): void => {
  srcs.filter(Boolean).forEach((src) => {
    void getGifObjectUrl(src);
  });
};

export const warmDecodeGif = async (src: string): Promise<void> => {
  const url = await getGifObjectUrl(src);
  const img = new Image();
  img.src = url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to warm decode GIF."));
  });
  try {
    await img.decode?.();
  } catch {
    // Swallow decode errors, still treat as warmed.
  }
};

export const warmDecodeFirstWorking = async (srcs: string[]): Promise<void> => {
  for (const src of srcs) {
    if (!src) continue;
    try {
      await warmDecodeGif(src);
      return;
    } catch {
      continue;
    }
  }
};
