import { describe, expect, it } from "vitest";
import { gameConfig } from "@/lib/config";
import {
  AnswerPickerRole,
  AnswerPickerStats,
  calculateBanCount,
  filterOptionsForRole,
  getEffectiveTarget,
  pickAnswer
} from "@/lib/answerPicker";
import type { Question } from "@/types/game";

const buildQuestion = (): Question => ({
  id: "test-question",
  prompt: "Pick one answer",
  answers: [
    { text: "Option 1", suspicion: 0 },
    { text: "Option 2", suspicion: 1 },
    { text: "Option 3", suspicion: 2 },
    { text: "Option 4", suspicion: 3 }
  ]
});

const weightForOptions = (question: Question, role: AnswerPickerRole, stats: AnswerPickerStats) => {
  const target = getEffectiveTarget({ role, stats });
  const candidates = filterOptionsForRole(question, role);
  const weights = candidates.map((entry) =>
    Math.exp(-Math.abs(entry.option.suspicion - target) * gameConfig.answerSelection.weightK)
  );
  return { candidates, weights };
};

const selectHighestWeight = (question: Question, role: AnswerPickerRole, stats: AnswerPickerStats) => {
  const { candidates, weights } = weightForOptions(question, role, stats);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const bestIndex = weights.reduce(
    (best, weight, idx) => (weight > best.weight ? { index: idx, weight } : best),
    { index: 0, weight: -Infinity }
  ).index;
  const prefix = weights.slice(0, bestIndex).reduce((sum, value) => sum + value, 0);
  const midPoint = prefix + (weights[bestIndex] ?? 0) / 2;
  const roll = totalWeight > 0 ? midPoint / totalWeight : 0;
  return pickAnswer({ question, role, stats, rng: () => roll });
};

const simulateSessionAverage = (role: AnswerPickerRole) => {
  const question = buildQuestion();
  let stats: AnswerPickerStats = { answeredCount: 0, totalSuspicion: 0 };
  for (let i = 0; i < gameConfig.questionsPerGame; i += 1) {
    const answer = selectHighestWeight(question, role, stats);
    stats = {
      answeredCount: stats.answeredCount + 1,
      totalSuspicion: stats.totalSuspicion + answer.option.suspicion
    };
  }
  return stats.totalSuspicion / stats.answeredCount;
};

describe("answer picker bans", () => {
  const question = buildQuestion();
  const stats: AnswerPickerStats = { answeredCount: 0, totalSuspicion: 0 };

  it("never exposes the top two suspicion options to human picks", () => {
    const candidates = filterOptionsForRole(question, "human");
    const topTwo = question.answers
      .map((option) => option.suspicion)
      .sort((a, b) => b - a)
      .slice(0, 2);
    const banned = new Set(topTwo);
    expect(candidates.every((entry) => !banned.has(entry.option.suspicion))).toBe(true);
    const answer = pickAnswer({ question, role: "human", stats, rng: () => 0.7 });
    expect(banned.has(answer.option.suspicion)).toBe(false);
  });

  it("never exposes the bottom two suspicion options to alien picks", () => {
    const candidates = filterOptionsForRole(question, "alien");
    const bottomTwo = question.answers
      .map((option) => option.suspicion)
      .sort((a, b) => a - b)
      .slice(0, 2);
    const banned = new Set(bottomTwo);
    expect(candidates.every((entry) => !banned.has(entry.option.suspicion))).toBe(true);
    const answer = pickAnswer({ question, role: "alien", stats, rng: () => 0.7 });
    expect(banned.has(answer.option.suspicion)).toBe(false);
  });
});

describe("ban count adjustments", () => {
  it("reduces the ban count to 1 when only three options exist", () => {
    expect(calculateBanCount(3)).toBe(1);
  });
});

describe("average balancing over five questions", () => {
  it("keeps human averages within the human suspicion band", () => {
    const avg = simulateSessionAverage("human");
    const range = gameConfig.answerSelection.targetMeanRange.human;
    expect(avg).toBeGreaterThanOrEqual(range.min);
    expect(avg).toBeLessThanOrEqual(range.max);
  });

  it("keeps alien averages within the alien suspicion band", () => {
    const avg = simulateSessionAverage("alien");
    const range = gameConfig.answerSelection.targetMeanRange.alien;
    expect(avg).toBeGreaterThanOrEqual(range.min);
    expect(avg).toBeLessThanOrEqual(range.max);
  });
});
