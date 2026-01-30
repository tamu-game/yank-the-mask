import { gameConfig } from "@/lib/config";
import type { FinalDecision, ScoreBreakdown } from "@/types/game";

export type ScoreInput = {
  isWin: boolean;
  decision: FinalDecision;
  isAlien: boolean;
  questionsAsked: number;
  totalQuestions: number;
  suspicion: number;
};

export const calculateScore = (input: ScoreInput): ScoreBreakdown => {
  const { isWin, decision, isAlien, questionsAsked, totalQuestions, suspicion } = input;
  const unused = Math.max(0, totalQuestions - questionsAsked);

  const base = isWin ? gameConfig.scoring.baseWin : gameConfig.scoring.baseLose;
  const questionBonus = isWin ? unused * gameConfig.scoring.questionBonusPerUnused : 0;

  const suspicionBonus = isAlien
    ? Math.round(Math.max(0, Math.min(10, suspicion)) * gameConfig.scoring.suspicionBonusMultiplier)
    : 0;

  let consolation = 0;
  if (!isWin && decision === "accuse" && !isAlien) {
    consolation = Math.min(
      gameConfig.scoring.maxConsolation,
      Math.floor(questionsAsked / 2) * gameConfig.scoring.consolationPerQuestion
    );
  }

  const total = Math.max(0, base + questionBonus + suspicionBonus + consolation);

  return {
    base,
    questionBonus,
    suspicionBonus,
    consolation,
    total
  };
};
