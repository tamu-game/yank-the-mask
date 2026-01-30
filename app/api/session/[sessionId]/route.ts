import { NextResponse } from "next/server";
import { memoryStore } from "@/store/memoryStore";
import { sanitizeSession } from "@/lib/sanitize";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function GET(_: Request, { params }: { params: { sessionId: string } }) {
  const session = await memoryStore.getSession(params.sessionId);
  if (!session) {
    return jsonError("Session not found.", 404, "not_found");
  }

  return NextResponse.json(sanitizeSession(session));
}
