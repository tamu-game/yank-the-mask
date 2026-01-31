import { NextRequest, NextResponse } from "next/server";
import { askQuestionSchema } from "@/validation/schemas";
import { getCharacterById } from "@/data/characters";
import { memoryStore } from "@/store/memoryStore";
import { addSuspicion, isAlienFromAverageSuspicion } from "@/lib/suspicion";
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

  const character = getCharacterById(session.characterId);
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

  if (!Array.isArray(question.answers) || question.answers.length === 0) {
    return jsonError("Question has no answers configured.", 500, "server_error");
  }

  const suspicionBefore = session.suspicion;
  const randomIndex = Math.floor(Math.random() * question.answers.length);
  const answerChoice = (randomIndex + 1) as AnswerChoice;
  const answer = question.answers[randomIndex];
  const answerText = answer?.text ?? "";
  const suspicionAfter = addSuspicion(suspicionBefore, answer?.suspicion ?? 0);
  const glitchChance = 0;

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

  const askedQuestionIds = [...session.askedQuestionIds, questionId];
  const answeredCount = askedQuestionIds.length;
  session.askedQuestionIds = askedQuestionIds;
  session.turns = [...session.turns, turn];
  session.suspicion = suspicionAfter;
  session.isAlien = isAlienFromAverageSuspicion(suspicionAfter, answeredCount);

  await memoryStore.updateSession(session);

  return NextResponse.json({
    answerText,
    answerChoice,
    suspicionAfter,
    glitchChance,
    turn
  });
}
