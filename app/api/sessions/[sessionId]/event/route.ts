import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";
import { sessionEventSchema } from "@/validation/schemas";
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
  const parsed = sessionEventSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: params.sessionId }
  });
  if (!session || session.userId !== auth.user.id) {
    return jsonError("Session not found.", 404, "not_found");
  }
  if (session.status !== "IN_PROGRESS") {
    return jsonError("Session has ended.", 409, "conflict");
  }

  const type = parsed.data.type;
  const nextQuestionCount =
    session.questionCount + (type === "QUESTION_ASKED" ? 1 : 0);
  const nextCorrectCount =
    session.correctCount + (type === "CORRECT_GUESS" ? 1 : 0);
  const nextWrongCount = session.wrongCount + (type === "WRONG_GUESS" ? 1 : 0);

  const nextScore = computeScore({
    questionCount: nextQuestionCount,
    correctCount: nextCorrectCount,
    wrongCount: nextWrongCount,
    status: session.status
  });
  const delta = nextScore - session.score;

  await prisma.$transaction([
    prisma.gameSession.update({
      where: { id: session.id },
      data: {
        questionCount: nextQuestionCount,
        correctCount: nextCorrectCount,
        wrongCount: nextWrongCount,
        score: nextScore
      }
    }),
    prisma.scoreEvent.create({
      data: {
        sessionId: session.id,
        type,
        delta
      }
    })
  ]);

  return NextResponse.json({ sessionId: session.id, score: nextScore, delta });
}
