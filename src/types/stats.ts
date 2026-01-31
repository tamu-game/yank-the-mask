export type GuessDistributionEntry = {
  question: number;
  winCount: number;
  percent: number;
};

export type GuessDistributionData = {
  maxQuestions: number;
  totalWins: number;
  distribution: GuessDistributionEntry[];
};
