import { gameConfig } from "@/lib/config";
import { createSeededRng } from "@/lib/rng";
import type { AnswerChoice, TurnLog } from "@/types/game";

export type AlienDecisionInput = {
  seed: string;
  questionId: string;
  choicesCount: number;
  previousTurns: TurnLog[];
  suspicion: number;
  totalQuestions: number;
};

export type AlienDecisionOutput = {
  choice: AnswerChoice;
  glitchChance: number;
};

const choiceWeightsByMood = (mood: "low" | "mid" | "high") => {
  if (mood === "high") {
    return { 1: 0.45, 2: 0.35, 3: 0.15, 4: 0.05 } as const;
  }
  if (mood === "low") {
    return { 1: 0.1, 2: 0.2, 3: 0.35, 4: 0.35 } as const;
  }
  return { 1: 0.25, 2: 0.4, 3: 0.25, 4: 0.1 } as const;
};

const clampSuspicion = (value: number) => {
  return Math.max(gameConfig.suspicionClamp.min, Math.min(gameConfig.suspicionClamp.max, value));
};

export const updateSuspicion = (current: number, choice: AnswerChoice) => {
  const weight =
    gameConfig.suspicionWeights[choice as keyof typeof gameConfig.suspicionWeights];
  return clampSuspicion(current + weight);
};

const pickWeighted = (rng: () => number, options: Array<{ choice: AnswerChoice; weight: number }>) => {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  if (total <= 0) {
    return options[0].choice;
  }
  let roll = rng() * total;
  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) {
      return option.choice;
    }
  }
  return options[options.length - 1].choice;
};

export const decideAlienAnswer = (input: AlienDecisionInput): AlienDecisionOutput => {
  const { seed, questionId, choicesCount, previousTurns, suspicion, totalQuestions } = input;
  const askedCount = previousTurns.length;
  const remainingAfter = totalQuestions - (askedCount + 1);
  const maxChoice = Math.max(2, Math.min(choicesCount, 4));
  const possibleChoices = [1, 2, 3, 4].slice(0, maxChoice) as AnswerChoice[];
  const obviousChoice = maxChoice as AnswerChoice;

  const lastStreak = (() => {
    let streak = 0;
    for (let i = previousTurns.length - 1; i >= 0; i -= 1) {
      if (previousTurns[i].answerChoice === 1) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  })();

  const usedObvious = previousTurns.filter((turn) => turn.answerChoice === obviousChoice).length;
  const nonPerfectCount = previousTurns.filter((turn) => turn.answerChoice !== 1).length;

  const mustBeNonPerfect =
    nonPerfectCount + remainingAfter < gameConfig.minNonPerfectByEnd ||
    lastStreak >= gameConfig.streakLimit;

  const allowedChoices: AnswerChoice[] = possibleChoices.filter((choice) => {
    if (choice === 1 && mustBeNonPerfect) {
      return false;
    }
    if (choice === obviousChoice && usedObvious >= gameConfig.maxObviousLies) {
      return false;
    }
    return true;
  }) as AnswerChoice[];

  const mood =
    suspicion >= gameConfig.suspicionThresholds.high
      ? "high"
      : suspicion <= gameConfig.suspicionThresholds.low
        ? "low"
        : "mid";

  const weights = choiceWeightsByMood(mood);
  const finalChoices = allowedChoices.length > 0 ? allowedChoices : possibleChoices;
  const weightedChoices = finalChoices.map((choice) => ({
    choice,
    weight: weights[choice]
  }));

  const rng = createSeededRng(`${seed}:${questionId}:${askedCount}`);
  const choice = pickWeighted(rng, weightedChoices);
  const glitchChance = Math.min(
    gameConfig.glitch.max,
    gameConfig.glitch.base + (choice - 1) * gameConfig.glitch.perWrong + rng() * 0.08
  );

  return {
    choice,
    glitchChance
  };
};
