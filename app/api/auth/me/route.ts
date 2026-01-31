import { NextRequest, NextResponse } from "next/server";
import { getOptionalAuthUser } from "@/server/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getOptionalAuthUser(request);
  return NextResponse.json({ user });
}
