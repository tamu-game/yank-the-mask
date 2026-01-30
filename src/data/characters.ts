import type { Character } from "@/types/game";
import seed from "@/data/characters.seed.json";

const seedCharacters = seed as Array<Omit<Character, "portraitSrc">>;

export const characters: Character[] = seedCharacters.map((character) => ({
  ...character,
  portraitSrc: "/characters/character.PNG"
}));

export const charactersById = new Map(characters.map((character) => [character.id, character]));
