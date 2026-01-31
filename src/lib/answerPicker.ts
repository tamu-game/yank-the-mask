import { gameConfig } from "@/lib/config";
import { createSeededRng } from "@/lib/rng";
import type { AnswerChoice, AnswerOption, Question } from "@/types/game";

export type AnswerPickerRole = "human" | "alien";

export type AnswerPickerStats = {
  answeredCount: number;
  totalSuspicion: number;
};

const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export const determineRole = (seed: string): AnswerPickerRole => {
  const rng = createSeededRng(`${seed}-role`);
  return rng() < gameConfig.alienChance ? "alien" : "human";
};

export const calculateBanCount = (optionCount: number) => {
  if (optionCount <= 1) {
    return 0;
  }

  const defaultBan = 2;
  const fallbackBan = Math.max(1, Math.floor((optionCount - 1) / 2));
  const targetBan = optionCount >= 4 ? defaultBan : fallbackBan;
  return Math.min(targetBan, optionCount - 1);
};

export const filterOptionsForRole = (question: Question, role: AnswerPickerRole) => {
  const sorted = question.answers
    .map((answer, index) => ({
      option: answer,
      choice: (index + 1) as AnswerChoice
    }))
    .sort((a, b) => a.option.suspicion - b.option.suspicion);

  const banCount = calculateBanCount(sorted.length);
  const candidates =
    role === "human"
      ? sorted.slice(0, sorted.length - banCount)
      : sorted.slice(banCount);

  if (candidates.length === 0 && sorted.length > 0) {
    return [sorted[0]];
  }

  return candidates;
};

export const getEffectiveTarget = (params: {
  role: AnswerPickerRole;
  stats: AnswerPickerStats;
}) => {
  const { role, stats } = params;
  const roleConfig = gameConfig.answerSelection;
  const baseTarget =
    role === "human" ? roleConfig.targetSuspicion.human : roleConfig.targetSuspicion.alien;
  const range =
    role === "human" ? roleConfig.targetMeanRange.human : roleConfig.targetMeanRange.alien;
  const answered = stats.answeredCount;
  const average = answered > 0 ? stats.totalSuspicion / answered : baseTarget;
  const remaining = Math.max(gameConfig.questionsPerGame - answered, 0);

  if (remaining > roleConfig.balancingWindow || (average >= range.min && average <= range.max)) {
    return baseTarget;
  }

  const rangeCenter = (range.min + range.max) / 2;
  const delta = (rangeCenter - average) * 0.7;
  return clamp(rangeCenter + delta, range.min, range.max);
};

export const pickAnswer = (params: {
  question: Question;
  role: AnswerPickerRole;
  stats: AnswerPickerStats;
  rng?: () => number;
}) => {
  const { question, role, stats, rng = Math.random } = params;
  const candidates = filterOptionsForRole(question, role);
  if (candidates.length === 0) {
    throw new Error("Question has no answer options.");
  }

  const target = getEffectiveTarget({ role, stats });
  const weights = candidates.map((entry) =>
    Math.exp(-Math.abs(entry.option.suspicion - target) * gameConfig.answerSelection.weightK)
  );
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  if (totalWeight <= 0) {
    return candidates[0];
  }

  const roll = rng() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < candidates.length; i += 1) {
    cumulative += weights[i];
    if (roll <= cumulative) {
      return candidates[i];
    }
  }

  return candidates[candidates.length - 1];
};
