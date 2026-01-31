import { NextRequest, NextResponse } from "next/server";
import { decideSchema } from "@/validation/schemas";
import { memoryStore } from "@/store/memoryStore";
import { gameConfig } from "@/lib/config";
import { calculateScore } from "@/lib/scoring";
import { getCharacterById } from "@/data/characters";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = decideSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const session = await memoryStore.getSession(params.sessionId);
  if (!session) {
    return jsonError("Session not found.", 404, "not_found");
  }
  if (session.status !== "in_progress") {
    return jsonError("Session has ended.", 409, "conflict");
  }

  if (session.askedQuestionIds.length < gameConfig.minQuestionsToDecide) {
    const questionLabel = gameConfig.minQuestionsToDecide === 1 ? "question" : "questions";
    return jsonError(
      `Ask at least ${gameConfig.minQuestionsToDecide} ${questionLabel} before deciding.`,
      409,
      "conflict"
    );
  }

  const { decision } = parsed.data;
  const isAlien = session.isAlien;
  const isWin =
    (decision === "accuse" && isAlien) || (decision === "trust" && !isAlien);

  const character = getCharacterById(session.characterId);
  if (!character) {
    return jsonError("Character not found.", 404, "not_found");
  }

  const outcome = isWin ? "win" : "lose";
  const breakdown = calculateScore({
    isWin,
    decision,
    isAlien,
    questionsAsked: session.askedQuestionIds.length,
    suspicion: session.suspicion,
    totalQuestions: character.questions.length
  });

  session.status = "ended";
  session.finalDecision = decision;
  session.finalOutcome = outcome;
  session.score = breakdown.total;
  session.scoreBreakdown = breakdown;
  session.isAlien = isAlien;

  await memoryStore.updateSession(session);

  return NextResponse.json({
    outcome,
    score: breakdown.total,
    breakdown
  });
}
