import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: params.sessionId },
    include: { scoreEvents: true }
  });

  if (!session || session.userId !== auth.user.id) {
    return jsonError("Session not found.", 404, "not_found");
  }

  return NextResponse.json({ session });
}
