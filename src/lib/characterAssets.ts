const ALIEN_ROOT = "/characters/alien";
const uppercasePortraitIds = new Set(["aylin-sakar"]);
const loveIds = new Set(["aylin-sakar", "walter-white"]);
const yankMaskIds = new Set(["aylin-sakar"]);
const yankMaskLoseIds = new Set(["aylin-sakar"]);

const uniqueSources = (sources: string[]) => {
  const seen = new Set<string>();
  return sources.filter((src) => {
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
};

const alienStaticSources = [`${ALIEN_ROOT}/alien.png`, `${ALIEN_ROOT}/alien.gif`];
const alienAnimatedSources = [`${ALIEN_ROOT}/alien.gif`, `${ALIEN_ROOT}/alien.png`];

const basePortraitSources = (characterId: string) => {
  const portraitBase = uppercasePortraitIds.has(characterId)
    ? [`/characters/${characterId}/character.PNG`, `/characters/${characterId}/character.png`]
    : [`/characters/${characterId}/character.png`, `/characters/${characterId}/character.PNG`];

  return uniqueSources([
    ...portraitBase,
    `/characters/${characterId}/character.gif`,
    ...alienStaticSources
  ]);
};

const baseAnimatedSources = (characterId: string) =>
  uniqueSources([
    `/characters/${characterId}/character.gif`,
    `/characters/${characterId}/character.png`,
    `/characters/${characterId}/character.PNG`,
    ...alienAnimatedSources
  ]);

export const getProfilePortraitSources = (characterId: string) => {
  return basePortraitSources(characterId);
};

export const getCafeIdleSources = (characterId: string) => {
  return baseAnimatedSources(characterId);
};

export const getTalkSources = (characterId: string) => {
  return uniqueSources([`/characters/${characterId}/talk.gif`, ...baseAnimatedSources(characterId)]);
};

export const getLoveSources = (characterId: string) => {
  const loveSources = loveIds.has(characterId)
    ? [`/characters/${characterId}/love.gif`]
    : [];

  return uniqueSources([...loveSources, ...baseAnimatedSources(characterId)]);
};

export const getAngryInitSources = (characterId: string) => {
  return uniqueSources([
    `/characters/${characterId}/angry_init.gif`,
    ...baseAnimatedSources(characterId)
  ]);
};

export const getAngryLoopSources = (characterId: string) => {
  return uniqueSources([
    `/characters/${characterId}/angry_loop.gif`,
    ...baseAnimatedSources(characterId)
  ]);
};

export const getYankSources = (characterId: string) => {
  const yankSources = yankMaskIds.has(characterId)
    ? [`/characters/${characterId}/yank_mask.gif`]
    : [];

  return uniqueSources([...yankSources, ...baseAnimatedSources(characterId)]);
};

export const getYankWinSources = (characterId: string) => {
  return uniqueSources([
    `/characters/${characterId}/yank_mask_win.gif`,
    ...baseAnimatedSources(characterId)
  ]);
};

export const getYankLoseSources = (characterId: string) => {
  const yankLoseSources = yankMaskLoseIds.has(characterId)
    ? [`/characters/${characterId}/yank_mask_lose.gif`]
    : [];

  return uniqueSources([...yankLoseSources, ...baseAnimatedSources(characterId)]);
};

export const getAlienIdleSources = () => {
  return [...alienStaticSources];
};

export const getAlienCrySources = (characterId: string) => {
  return uniqueSources([
    `/characters/${characterId}/alien_cry.gif`,
    `${ALIEN_ROOT}/alien_cry.gif`,
    ...alienAnimatedSources
  ]);
};

export const getAlienLaughSources = () => {
  return uniqueSources([`${ALIEN_ROOT}/alien_laugh.gif`, ...alienAnimatedSources]);
};
