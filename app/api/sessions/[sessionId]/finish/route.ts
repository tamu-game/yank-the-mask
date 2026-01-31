import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";
import { finishSessionSchema } from "@/validation/schemas";
import { computeScore } from "@/server/score";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = finishSessionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: params.sessionId }
  });
  if (session && session.userId !== auth.user.id) {
    return jsonError("Session not found.", 404, "not_found");
  }
  if (session && session.status !== "IN_PROGRESS") {
    return jsonError("Session has ended.", 409, "conflict");
  }

  const nextStatus = parsed.data.status ?? "COMPLETED";
  const fallbackQuestionCount = parsed.data.questionCount ?? 0;
  const inferredOutcome =
    session && session.correctCount > session.wrongCount
      ? "WIN"
      : session && session.wrongCount > session.correctCount
        ? "LOSE"
        : null;
  const nextOutcome =
    nextStatus === "COMPLETED" ? parsed.data.outcome ?? inferredOutcome : null;
  const nextQuestionCount = session
    ? Math.max(session.questionCount, fallbackQuestionCount)
    : fallbackQuestionCount;
  const nextCorrectCount = session
    ? Math.max(session.correctCount, nextOutcome === "WIN" ? 1 : 0)
    : nextOutcome === "WIN"
      ? 1
      : 0;
  const nextWrongCount = session
    ? Math.max(session.wrongCount, nextOutcome === "LOSE" ? 1 : 0)
    : nextOutcome === "LOSE"
      ? 1
      : 0;
  const guessedAtQuestion =
    nextOutcome === "WIN" ? Math.max(1, nextQuestionCount) : null;
  const nextScore = computeScore({
    questionCount: nextQuestionCount,
    correctCount: nextCorrectCount,
    wrongCount: nextWrongCount,
    status: nextStatus
  });
  const delta = nextScore - (session?.score ?? 0);
  const resolvedSessionId = session?.id ?? params.sessionId;

  if (!session) {
    await prisma.$transaction([
      prisma.gameSession.create({
        data: {
          id: params.sessionId,
          userId: auth.user.id,
          characterId: parsed.data.characterId ?? null,
          status: nextStatus,
          endedAt: new Date(),
          outcome: nextOutcome,
          guessedAtQuestion,
          questionCount: nextQuestionCount,
          correctCount: nextCorrectCount,
          wrongCount: nextWrongCount,
          score: nextScore
        }
      }),
      prisma.scoreEvent.create({
        data: {
          sessionId: params.sessionId,
          type: "OTHER",
          delta
        }
      })
    ]);
  } else {
    await prisma.$transaction([
      prisma.gameSession.update({
        where: { id: session.id },
        data: {
          status: nextStatus,
          endedAt: new Date(),
          score: nextScore,
          outcome: nextOutcome,
          guessedAtQuestion,
          questionCount: nextQuestionCount,
          correctCount: nextCorrectCount,
          wrongCount: nextWrongCount,
          characterId: parsed.data.characterId ?? session.characterId
        }
      }),
      prisma.scoreEvent.create({
        data: {
          sessionId: session.id,
          type: "OTHER",
          delta
        }
      })
    ]);
  }

  return NextResponse.json({
    sessionId: resolvedSessionId,
    score: nextScore,
    status: nextStatus,
    outcome: nextOutcome,
    guessedAtQuestion
  });
}
