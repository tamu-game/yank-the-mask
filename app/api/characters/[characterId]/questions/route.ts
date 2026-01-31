import { NextResponse } from "next/server";
import { getCharacterById } from "@/data/characters";

export const runtime = "nodejs";

const jsonError = (message: string, status = 400, code = "bad_request") => {
  return NextResponse.json({ error: { code, message } }, { status });
};

export async function GET(
  _: Request,
  { params }: { params: { characterId: string } }
) {
  const character = getCharacterById(params.characterId);
  if (!character) {
    return jsonError("Character not found.", 404, "not_found");
  }

  return NextResponse.json({
    characterId: character.id,
    questions: character.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt
    }))
  });
}
