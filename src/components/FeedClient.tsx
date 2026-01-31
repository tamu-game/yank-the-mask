"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CharacterPreview } from "@/types/game";
import { CardStack } from "@/components/CardStack";

export const FeedClient = ({ characters }: { characters: CharacterPreview[] }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwipeRight = async (character: CharacterPreview) => {
    if (creating) return;
    setError(null);
    setCreating(true);
    try {
      const response = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: character.id })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Failed to start session.");
      }
      setIsTransitioning(true);
      await new Promise((resolve) => window.setTimeout(resolve, 240));
      router.push(`/match/${character.id}?sessionId=${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className={`flex w-full justify-center transition-all duration-300 ease-out ${
          isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        }`}
      >
        <CardStack
          characters={characters}
          onSwipeLeft={() => null}
          onSwipeRight={handleSwipeRight}
        />
      </div>
      {creating ? (
        <p className="text-xs text-rose-500"></p>
      ) : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
};
