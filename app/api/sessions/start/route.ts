import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";
import { startSessionSchema } from "@/validation/schemas";
import { computeScore } from "@/server/score";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = startSessionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const sessionId = parsed.data.sessionId ?? crypto.randomUUID();
  const characterId = parsed.data.characterId;
  const existing = await prisma.gameSession.findUnique({
    where: { id: sessionId }
  });

  if (existing) {
    if (existing.userId !== auth.user.id) {
      return jsonError("Session not found.", 404, "not_found");
    }
    if (characterId && existing.characterId !== characterId) {
      await prisma.gameSession.update({
        where: { id: existing.id },
        data: { characterId }
      });
    }
    return NextResponse.json({ sessionId: existing.id });
  }

  const session = await prisma.gameSession.create({
    data: {
      id: sessionId,
      userId: auth.user.id,
      characterId,
      status: "IN_PROGRESS",
      questionCount: 0,
      correctCount: 0,
      wrongCount: 0,
      score: computeScore({
        questionCount: 0,
        correctCount: 0,
        wrongCount: 0,
        status: "IN_PROGRESS"
      })
    },
    select: { id: true }
  });

  return NextResponse.json({ sessionId: session.id });
}
