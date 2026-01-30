import type { Character, Question, AnswerOption, CharacterProfile } from "@/types/game";
import seed from "@/data/characters.seed.json";

const WEIGHTS = [0, 0.3, 0.7, 1.2, 2.0];

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

const buildAnswers = (correct: string, pool: string[]): AnswerOption[] => {
  const distractors = pickOptions(pool, correct, 4);
  const all = [correct, ...distractors];
  return all.map((text, index) => ({
    text,
    weight: WEIGHTS[index]
  }));
};

const createQuestions = (characterId: string, profile: CharacterProfile): Question[] => {
  return [
    {
      id: `${characterId}-q1`,
      prompt: "Which movie is my comfort rewatch?",
      answers: buildAnswers(profile.movies[0], MOVIES)
    },
    {
      id: `${characterId}-q2`,
      prompt: "Which movie do I quote the most?",
      answers: buildAnswers(profile.movies[1], MOVIES)
    },
    {
      id: `${characterId}-q3`,
      prompt: "Which movie did I cry in?",
      answers: buildAnswers(profile.movies[2], MOVIES)
    },
    {
      id: `${characterId}-q4`,
      prompt: "Which show would I cancel plans for?",
      answers: buildAnswers(profile.shows[0], SHOWS)
    },
    {
      id: `${characterId}-q5`,
      prompt: "Which show do I binge on rainy days?",
      answers: buildAnswers(profile.shows[1], SHOWS)
    },
    {
      id: `${characterId}-q6`,
      prompt: "Which show has my favorite character?",
      answers: buildAnswers(profile.shows[2], SHOWS)
    },
    {
      id: `${characterId}-q7`,
      prompt: "Which sport or activity do I actually enjoy?",
      answers: buildAnswers(profile.sports[0], SPORTS)
    },
    {
      id: `${characterId}-q8`,
      prompt: "Which weekend activity sounds perfect?",
      answers: buildAnswers(profile.sports[1], SPORTS)
    },
    {
      id: `${characterId}-q9`,
      prompt: "Which trait do friends say I have most?",
      answers: buildAnswers(profile.traits[0], TRAITS)
    },
    {
      id: `${characterId}-q10`,
      prompt: "Which trait gets me in trouble?",
      answers: buildAnswers(profile.traits[1], TRAITS)
    }
  ];
};

const seedCharacters = seed as Array<Omit<Character, "questions" | "portraitSrc">>;

export const characters: Character[] = seedCharacters.map((character) => ({
  ...character,
  portraitSrc: "/characters/character.PNG",
  questions: createQuestions(character.id, character.profile)
}));

export const charactersById = new Map(characters.map((character) => [character.id, character]));
