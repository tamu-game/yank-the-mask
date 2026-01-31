import type { GameSessionStatus } from "@prisma/client";

type ScoreInput = {
  questionCount: number;
  correctCount: number;
  wrongCount: number;
  status: GameSessionStatus;
};

export const computeScore = ({
  questionCount,
  correctCount,
  wrongCount,
  status
}: ScoreInput) => {
  const base = 1000;
  const questionPenalty = questionCount * 40;
  const correctBonus = correctCount * 150;
  const wrongPenalty = wrongCount * 200;
  const completionBonus = status === "COMPLETED" ? 100 : status === "ABANDONED" ? -50 : 0;
  const rawScore = base - questionPenalty + correctBonus - wrongPenalty + completionBonus;
  return Math.max(0, rawScore);
};
