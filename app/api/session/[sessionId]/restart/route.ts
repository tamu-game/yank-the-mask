import { NextResponse } from "next/server";
import { memoryStore } from "@/store/memoryStore";
import { createSeed } from "@/lib/rng";
import type { Session } from "@/types/game";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(_: Request, { params }: { params: { sessionId: string } }) {
  const session = await memoryStore.getSession(params.sessionId);
  if (!session) {
    return jsonError("Session not found.", 404, "not_found");
  }

  if (session.status !== "ended") {
    session.status = "ended";
    await memoryStore.updateSession(session);
  }

  const seed = createSeed();
  const newSession: Session = {
    id: crypto.randomUUID(),
    seed,
    characterId: session.characterId,
    isAlien: false,
    askedQuestionIds: [],
    turns: [],
    suspicion: 0,
    status: "in_progress",
    finalDecision: null,
    finalOutcome: null,
    score: 0,
    scoreBreakdown: null
  };

  await memoryStore.createSession(newSession);

  return NextResponse.json({ sessionId: newSession.id });
}
