import { NextRequest, NextResponse } from "next/server";
import { askQuestionSchema } from "@/validation/schemas";
import { charactersById } from "@/data/characters";
import { memoryStore } from "@/store/memoryStore";
import { decideAlienAnswer, updateSuspicion } from "@/lib/alienBrain";
import { nowIso } from "@/lib/time";
import type { AnswerChoice, TurnLog } from "@/types/game";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = askQuestionSchema.safeParse(body);
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

  const character = charactersById.get(session.characterId);
  if (!character) {
    return jsonError("Character not found.", 404, "not_found");
  }

  const { questionId } = parsed.data;
  const question = character.questions.find((item) => item.id === questionId);
  if (!question) {
    return jsonError("Question not found.", 404, "not_found");
  }

  if (session.askedQuestionIds.includes(questionId)) {
    return jsonError("Question already asked.", 409, "conflict");
  }

  const suspicionBefore = session.suspicion;
  let answerChoice: AnswerChoice = 1;
  let glitchChance = 0;

  if (session.isAlien) {
    const decision = decideAlienAnswer({
      seed: session.seed,
      questionId,
      previousTurns: session.turns,
      suspicion: session.suspicion
    });
    answerChoice = decision.choice;
    glitchChance = decision.glitchChance;
  }

  const answerText = question.answers[answerChoice - 1]?.text ?? question.answers[0].text;
  const suspicionAfter = updateSuspicion(suspicionBefore, answerChoice);

  const turn: TurnLog = {
    id: crypto.randomUUID(),
    questionId,
    questionPrompt: question.prompt,
    answerChoice,
    answerText,
    suspicionBefore,
    suspicionAfter,
    glitchChance,
    timestamp: nowIso()
  };

  session.askedQuestionIds = [...session.askedQuestionIds, questionId];
  session.turns = [...session.turns, turn];
  session.suspicion = suspicionAfter;

  await memoryStore.updateSession(session);

  return NextResponse.json({
    answerText,
    answerChoice,
    suspicionAfter,
    glitchChance,
    turn
  });
}
