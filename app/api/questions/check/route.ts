import { NextRequest, NextResponse } from "next/server";
import { answerCheckSchema } from "@/validation/schemas";
import { checkAnswer } from "@/lib/answerCheck";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = answerCheckSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const result = checkAnswer(parsed.data);
  if (result.status !== 200) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.body);
}
