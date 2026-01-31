import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validation/schemas";
import { prisma } from "@/server/db";
import {
  buildAuthCookie,
  normalizeEmail,
  signAuthToken,
  verifyPassword
} from "@/server/auth";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request body.");
  }

  const { email, password } = parsed.data;
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, firstName: true, lastName: true, email: true, passwordHash: true }
  });

  if (!user) {
    return jsonError("Email veya şifre hatalı", 401, "unauthorized");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return jsonError("Email veya şifre hatalı", 401, "unauthorized");
  }

  const token = signAuthToken({ sub: user.id, email: user.email });
  const response = NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });
  response.cookies.set(buildAuthCookie(token));
  return response;
}
