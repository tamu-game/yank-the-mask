export const gameConfig = {
  totalQuestions: 10,
  alienChance: 0.45,
  streakLimit: 3,
  maxObviousLies: 1,
  minNonPerfectByEnd: 2,
  suspicionWeights: {
    1: -0.2,
    2: 0.3,
    3: 0.7,
    4: 1.2,
    5: 2.0
  },
  suspicionClamp: {
    min: 0,
    max: 10
  },
  suspicionThresholds: {
    low: 3,
    high: 7
  },
  glitch: {
    base: 0.06,
    perWrong: 0.07,
    max: 0.35
  },
  scoring: {
    baseWin: 120,
    baseLose: 20,
    questionBonusPerUnused: 6,
    suspicionBonusMultiplier: 5,
    consolationPerQuestion: 2,
    maxConsolation: 16
  }
} as const;
