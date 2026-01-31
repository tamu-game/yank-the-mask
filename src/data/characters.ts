import type { Character } from "@/types/game";
import seed from "@/data/characters.seed.json";
import { getProfilePortraitSources } from "@/lib/characterAssets";

type SeedCharacter = Omit<Character, "portraitSrc">;

const seedCharacters = seed as SeedCharacter[];

export const characters: Character[] = seedCharacters.map((character) => ({
  ...character,
  portraitSrc: getProfilePortraitSources(character.id)[0] ?? "/characters/alien/alien.png"
}));

export const charactersById = new Map(characters.map((character) => [character.id, character]));

export const getCharacterById = (characterId: string) => {
  return charactersById.get(characterId);
};
