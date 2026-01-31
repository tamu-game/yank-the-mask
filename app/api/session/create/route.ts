import { NextRequest, NextResponse } from "next/server";
import { createSessionSchema } from "@/validation/schemas";
import { getCharacterById } from "@/data/characters";
import { memoryStore } from "@/store/memoryStore";
import { createSeed } from "@/lib/rng";
import type { Session } from "@/types/game";
import { determineRole } from "@/lib/answerPicker";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const { characterId } = parsed.data;
  const character = getCharacterById(characterId);
  if (!character) {
    return jsonError("Character not found.", 404, "not_found");
  }

  const seed = createSeed();
  const session: Session = {
    id: crypto.randomUUID(),
    seed,
    characterId,
    isAlien: determineRole(seed) === "alien",
    askedQuestionIds: [],
    turns: [],
    suspicion: 0,
    status: "in_progress",
    finalDecision: null,
    finalOutcome: null,
    score: 0,
    scoreBreakdown: null
  };

  await memoryStore.createSession(session);

  return NextResponse.json({ sessionId: session.id });
}
