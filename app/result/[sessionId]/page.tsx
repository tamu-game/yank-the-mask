"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { CafeScene } from "@/components/cafe/CafeScene";
import { charactersById } from "@/data/characters";
import { getCharacterPreview } from "@/lib/sanitize";
import type { SessionPublic } from "@/types/game";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load result.");
  }
  return data as SessionPublic;
};

const storyCopy: Record<string, { title: string; line: string; status: string }> = {
  "accuse-win": {
    title: "Mask Pulled!",
    line: "The alien froze mid-smile. The ship is already on its way.",
    status: "You win"
  },
  "accuse-lose": {
    title: "Wrong Mask",
    line: "Awkward silence. A gentle slap. You deserved it.",
    status: "You lose"
  },
  "trust-win": {
    title: "Good Vibes",
    line: "No abductions today. Just a warm, human connection.",
    status: "You win"
  },
  "trust-lose": {
    title: "Beam Me Up",
    line: "You trusted the mask. A UFO trusted your address.",
    status: "You lose"
  }
};

export default function ResultPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { data: session, error } = useSWR(`/api/session/${params.sessionId}`, fetcher);

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="px-6 py-10 text-center text-sm text-rose-500">{error.message}</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen">
        <div className="px-6 py-10 text-center text-sm text-slate-500">Loading result...</div>
      </main>
    );
  }

  if (session.status !== "ended" || !session.finalDecision || !session.finalOutcome) {
    return (
      <main className="min-h-screen">
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          This date is still in progress.
        </div>
      </main>
    );
  }

  const key = `${session.finalDecision}-${session.finalOutcome}`;
  const story = storyCopy[key] ?? {
    title: "The date ends",
    line: "Something happened out there in the stars.",
    status: "Result"
  };
  const character = charactersById.get(session.characterId);
  if (!character) {
    return (
      <main className="min-h-screen">
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          Character not found.
        </div>
      </main>
    );
  }
  const preview = getCharacterPreview(character);
  const revealAlien = session.finalDecision === "accuse" && session.finalOutcome === "win";
  const portraitOverrideSrc = revealAlien ? "/characters/alien.png" : "/characters/character.gif";
  const portraitOverrideAlt = revealAlien ? "Alien revealed" : "Character idle";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <CafeScene
        className="absolute inset-0"
        character={preview}
        questionText={null}
        answerText={null}
        answerKey={null}
        portraitOverrideSrc={portraitOverrideSrc}
        portraitOverrideAlt={portraitOverrideAlt}
        isTyping={false}
        glitch={false}
        suspicion={0}
      />
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-4">
        <div className="pointer-events-auto w-full max-w-xl">
          <div className="rounded-[24px] border border-white/70 bg-white/95 p-5 text-center shadow-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-400">
              {story.status}
            </div>
            <div className="text-base font-semibold text-slate-700">{story.title}</div>
            <p className="mt-2 text-xs text-slate-500">{story.line}</p>
            <Button className="mt-5 w-full" onClick={() => router.push("/feed")}>
              Play again
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
