import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db";
import type { AuthUser } from "@/types/auth";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_COOKIE_NAME = "maskle_auth";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return secret;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash);
};

export const signAuthToken = (payload: { sub: string; email: string }) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & {
    sub: string;
    email: string;
  };
};

export const getAuthToken = (request: NextRequest) => {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
};

export const buildAuthCookie = (token: string) => ({
  name: AUTH_COOKIE_NAME,
  value: token,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TOKEN_TTL_SECONDS
});

export const clearAuthCookie = () => ({
  name: AUTH_COOKIE_NAME,
  value: "",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 0
});

export const getOptionalAuthUser = async (request: NextRequest): Promise<AuthUser | null> => {
  const token = getAuthToken(request);
  if (!token) return null;
  let payload: { sub: string; email: string };
  try {
    payload = verifyAuthToken(token);
  } catch {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, firstName: true, lastName: true, email: true }
  });
  return user ?? null;
};

export const requireAuth = async (request: NextRequest) => {
  const user = await getOptionalAuthUser(request);
  if (!user) {
    return {
      error: NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized." } },
        { status: 401 }
      )
    };
  }
  return { user };
};
