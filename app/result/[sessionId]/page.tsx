"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { TopBar } from "@/components/TopBar";
import type { SessionPublic } from "@/types/game";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load result.");
  }
  return data as SessionPublic;
};

const storyCopy: Record<string, { title: string; line: string }> = {
  "accuse-win": {
    title: "Mask Pulled!",
    line: "The alien froze mid-smile. The ship is already on its way."
  },
  "accuse-lose": {
    title: "Wrong Mask",
    line: "Awkward silence. A gentle slap. You deserved it."
  },
  "trust-win": {
    title: "Good Vibes",
    line: "No abductions today. Just a warm, human connection."
  },
  "trust-lose": {
    title: "Beam Me Up",
    line: "You trusted the mask. A UFO trusted your address."
  }
};

export default function ResultPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { data: session, error } = useSWR(`/api/session/${params.sessionId}`, fetcher);

  if (error) {
    return (
      <main className="min-h-screen">
        <TopBar title="Result" backHref="/feed" />
        <div className="px-6 py-10 text-center text-sm text-rose-500">{error.message}</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen">
        <TopBar title="Result" backHref="/feed" />
        <div className="px-6 py-10 text-center text-sm text-slate-500">Loading result...</div>
      </main>
    );
  }

  if (session.status !== "ended" || !session.finalDecision || !session.finalOutcome) {
    return (
      <main className="min-h-screen">
        <TopBar title="Result" backHref="/feed" />
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          This date is still in progress.
        </div>
      </main>
    );
  }

  const key = `${session.finalDecision}-${session.finalOutcome}`;
  const story = storyCopy[key] ?? {
    title: "The date ends",
    line: "Something happened out there in the stars."
  };

  return (
    <main className="min-h-screen">
      <TopBar title="Result" backHref="/feed" />
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="rounded-3xl border-2 border-white/80 bg-white/80 p-6 text-center shadow-xl">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-rose-200 to-purple-200" />
          <h1 className="text-2xl font-semibold text-slate-700">{story.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{story.line}</p>
        </div>

        <div className="rounded-3xl border-2 border-white/80 bg-white/80 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-700">Score</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Base points</span>
              <span>{session.scoreBreakdown?.base ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Question bonus</span>
              <span>{session.scoreBreakdown?.questionBonus ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Alien read bonus</span>
              <span>{session.scoreBreakdown?.suspicionBonus ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Consolation</span>
              <span>{session.scoreBreakdown?.consolation ?? 0}</span>
            </div>
            <div className="mt-4 flex justify-between text-base font-semibold text-slate-700">
              <span>Total</span>
              <span>{session.score}</span>
            </div>
          </div>
        </div>

        <Button onClick={() => router.push("/feed")}>Play again</Button>
      </div>
    </main>
  );
}
