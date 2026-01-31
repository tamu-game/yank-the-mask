import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { characters, getCharacterById } from "@/data/characters";

export const runtime = "nodejs";

const getMaxQuestions = (characterId?: string | null) => {
  if (characterId) {
    const character = getCharacterById(characterId);
    if (character) {
      return character.questions.length;
    }
  }
  const fallback = characters.length
    ? Math.max(...characters.map((character) => character.questions.length))
    : 10;
  return fallback || 10;
};

export async function GET(request: NextRequest) {
  const characterId = request.nextUrl.searchParams.get("characterId");
  const maxQuestions = getMaxQuestions(characterId);

  const where = {
    status: "COMPLETED" as const,
    outcome: "WIN" as const,
    guessedAtQuestion: { not: null },
    ...(characterId ? { characterId } : {})
  };

  const totalWins = await prisma.gameSession.count({ where });
  const grouped = await prisma.gameSession.groupBy({
    by: ["guessedAtQuestion"],
    where,
    _count: { _all: true }
  });

  const counts = new Map<number, number>();
  for (const entry of grouped) {
    if (!entry.guessedAtQuestion) continue;
    counts.set(entry.guessedAtQuestion, entry._count._all);
  }

  const distribution = Array.from({ length: maxQuestions }, (_, index) => {
    const question = index + 1;
    const winCount = counts.get(question) ?? 0;
    const percent =
      totalWins > 0 ? Number(((winCount / totalWins) * 100).toFixed(1)) : 0;
    return { question, winCount, percent };
  });

  return NextResponse.json({
    maxQuestions,
    totalWins,
    distribution
  });
}
