import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validation/schemas";
import { prisma } from "@/server/db";
import {
  buildAuthCookie,
  hashPassword,
  normalizeEmail,
  signAuthToken
} from "@/server/auth";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const { firstName, lastName, email, password } = parsed.data;
  const normalizedEmail = normalizeEmail(email);

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true }
  });
  if (existing) {
    return jsonError("Bu email zaten kayıtlı", 409, "conflict");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      passwordHash
    },
    select: { id: true, firstName: true, lastName: true, email: true }
  });

  const token = signAuthToken({ sub: user.id, email: user.email });
  const response = NextResponse.json({ user });
  response.cookies.set(buildAuthCookie(token));
  return response;
}
