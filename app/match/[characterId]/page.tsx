import { notFound } from "next/navigation";
import { charactersById } from "@/data/characters";
import { getCharacterPublic } from "@/lib/sanitize";
import { MatchClient } from "@/components/MatchClient";

export default function MatchPage({
  params,
  searchParams
}: {
  params: { characterId: string };
  searchParams: { sessionId?: string };
}) {
  const character = charactersById.get(params.characterId);
  if (!character) {
    notFound();
  }
  const publicCharacter = getCharacterPublic(character);

  return (
    <main className="min-h-screen">
      <MatchClient
        character={publicCharacter}
        questions={publicCharacter.questions}
        sessionId={searchParams.sessionId ?? null}
      />
    </main>
  );
}
