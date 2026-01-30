import type { Character, Question, CharacterProfile } from "@/types/game";
import seed from "@/data/characters.seed.json";
import { gameConfig } from "@/lib/config";

const TOTAL_QUESTIONS = gameConfig.totalQuestions;

const MOVIES = [
  "Spirited Away",
  "The Matrix",
  "Amelie",
  "Interstellar",
  "The Grand Budapest Hotel",
  "Spider-Verse",
  "Arrival",
  "Clueless",
  "The Princess Bride",
  "The Dark Knight",
  "Parasite",
  "Whiplash"
];

const SHOWS = [
  "Fleabag",
  "The Bear",
  "Brooklyn Nine-Nine",
  "The Office",
  "Stranger Things",
  "Succession",
  "Ted Lasso",
  "The Good Place",
  "Arcane",
  "Severance",
  "Avatar: The Last Airbender",
  "Schitts Creek"
];

const SPORTS = [
  "cycling",
  "yoga",
  "hiking",
  "basketball",
  "climbing",
  "tennis",
  "surfing",
  "kayaking",
  "skating",
  "pilates",
  "soccer",
  "running"
];

const TRAITS = [
  "curious",
  "witty",
  "organized",
  "bold",
  "patient",
  "adventurous",
  "calm",
  "creative",
  "loyal",
  "optimistic",
  "playful",
  "thoughtful"
];

const pickOptions = (pool: string[], exclude: string, count: number) => {
  const options: string[] = [];
  for (const item of pool) {
    if (item !== exclude) {
      options.push(item);
    }
    if (options.length === count) {
      break;
    }
  }
  return options;
};

const buildOptions = (correct: string, pool: string[], count = 4) => {
  const safeCorrect = correct || pool[0] || "Unknown";
  const distractors = pickOptions(pool, safeCorrect, Math.max(1, count - 1));
  const all = [safeCorrect, ...distractors];
  return all.slice(0, Math.max(2, Math.min(count, 4)));
};

const createFallbackQuestions = (characterId: string, profile: CharacterProfile): Question[] => {
  return [
    {
      id: `${characterId}_q1`,
      text: "Which movie is my comfort rewatch?",
      type: "choice",
      options: buildOptions(profile.movies[0], MOVIES),
      correctAnswer: profile.movies[0] || MOVIES[0]
    },
    {
      id: `${characterId}_q2`,
      text: "Which movie do I quote the most?",
      type: "choice",
      options: buildOptions(profile.movies[1], MOVIES),
      correctAnswer: profile.movies[1] || MOVIES[1]
    },
    {
      id: `${characterId}_q3`,
      text: "Which movie did I cry in?",
      type: "choice",
      options: buildOptions(profile.movies[2], MOVIES),
      correctAnswer: profile.movies[2] || MOVIES[2]
    },
    {
      id: `${characterId}_q4`,
      text: "Which show would I cancel plans for?",
      type: "choice",
      options: buildOptions(profile.shows[0], SHOWS),
      correctAnswer: profile.shows[0] || SHOWS[0]
    },
    {
      id: `${characterId}_q5`,
      text: "Which show do I binge on rainy days?",
      type: "choice",
      options: buildOptions(profile.shows[1], SHOWS),
      correctAnswer: profile.shows[1] || SHOWS[1]
    },
    {
      id: `${characterId}_q6`,
      text: "Which show has my favorite character?",
      type: "choice",
      options: buildOptions(profile.shows[2], SHOWS),
      correctAnswer: profile.shows[2] || SHOWS[2]
    },
    {
      id: `${characterId}_q7`,
      text: "Which sport or activity do I actually enjoy?",
      type: "choice",
      options: buildOptions(profile.sports[0], SPORTS),
      correctAnswer: profile.sports[0] || SPORTS[0]
    },
    {
      id: `${characterId}_q8`,
      text: "Which weekend activity sounds perfect?",
      type: "choice",
      options: buildOptions(profile.sports[1], SPORTS),
      correctAnswer: profile.sports[1] || SPORTS[1]
    },
    {
      id: `${characterId}_q9`,
      text: "Which trait do friends say I have most?",
      type: "choice",
      options: buildOptions(profile.traits[0], TRAITS),
      correctAnswer: profile.traits[0] || TRAITS[0]
    },
    {
      id: `${characterId}_q10`,
      text: "Which trait gets me in trouble?",
      type: "choice",
      options: buildOptions(profile.traits[1], TRAITS),
      correctAnswer: profile.traits[1] || TRAITS[1]
    }
  ];
};

const normalizeQuestion = (characterId: string, question: Question, index: number): Question => {
  const options = Array.isArray(question.options) ? question.options.filter(Boolean) : [];
  const uniqueOptions = Array.from(new Set(options));
  const correctAnswer = question.correctAnswer || uniqueOptions[0] || "";
  const normalizedOptions = uniqueOptions.includes(correctAnswer)
    ? uniqueOptions
    : [correctAnswer, ...uniqueOptions];
  return {
    id: question.id || `${characterId}_q${index + 1}`,
    text: question.text,
    type: "choice",
    options: normalizedOptions.slice(0, 4),
    correctAnswer
  };
};

const normalizeQuestions = (characterId: string, questions: Question[]) => {
  return questions.map((question, index) => normalizeQuestion(characterId, question, index));
};

type SeedCharacter = Omit<Character, "portraitSrc" | "questions"> & {
  questions?: Question[];
};

const seedCharacters = seed as SeedCharacter[];
export const fallbackCharacterIds = new Set<string>();

export const characters: Character[] = seedCharacters.map((character) => {
  const providedQuestions = Array.isArray(character.questions) ? character.questions : [];
  const fallbackQuestions = createFallbackQuestions(character.id, character.profile);
  const questions =
    providedQuestions.length >= TOTAL_QUESTIONS
      ? normalizeQuestions(character.id, providedQuestions).slice(0, TOTAL_QUESTIONS)
      : normalizeQuestions(character.id, [
          ...providedQuestions,
          ...fallbackQuestions.slice(providedQuestions.length)
        ]).slice(0, TOTAL_QUESTIONS);
  if (providedQuestions.length < TOTAL_QUESTIONS) {
    fallbackCharacterIds.add(character.id);
  }

  return {
    ...character,
    portraitSrc: "/characters/character.PNG",
    questions
  };
});

export const charactersById = new Map(characters.map((character) => [character.id, character]));

export const getCharacterById = (characterId: string) => {
  return charactersById.get(characterId);
};

export const getFallbackQuestions = (characterId: string, profile: CharacterProfile) => {
  return createFallbackQuestions(characterId, profile);
};
