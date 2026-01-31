import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  const sessions = await prisma.gameSession.findMany({
    where: { userId: auth.user.id },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      startedAt: true,
      endedAt: true,
      status: true,
      questionCount: true,
      correctCount: true,
      wrongCount: true,
      score: true,
      summary: true
    }
  });

  return NextResponse.json({ sessions });
}
