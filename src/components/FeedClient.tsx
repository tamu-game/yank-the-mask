"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CharacterPreview } from "@/types/game";
import { CardStack } from "@/components/CardStack";

export const FeedClient = ({ characters }: { characters: CharacterPreview[] }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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
      router.push(`/match/${character.id}?sessionId=${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CardStack
        characters={characters}
        onSwipeLeft={() => null}
        onSwipeRight={handleSwipeRight}
      />
      {creating ? (
        <p className="text-xs text-rose-500">Setting up your cafe date...</p>
      ) : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
};
