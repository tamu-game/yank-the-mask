import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/server/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearAuthCookie());
  return response;
}
