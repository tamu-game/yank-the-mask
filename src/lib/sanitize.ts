import type { Character, CharacterPreview, CharacterPublic, Session, SessionPublic } from "@/types/game";

export const sanitizeSession = (session: Session): SessionPublic => {
  const { seed: _seed, isAlien: _isAlien, ...rest } = session;
  return rest;
};

export const getCharacterPreview = (character: Character): CharacterPreview => {
  const { id, name, age, avatarSeed, portraitSrc, tags, bio, traits } = character;
  return { id, name, age, avatarSeed, portraitSrc, tags, bio, traits };
};

export const getCharacterPublic = (character: Character): CharacterPublic => {
  return {
    ...getCharacterPreview(character),
    questions: character.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt
    }))
  };
};
