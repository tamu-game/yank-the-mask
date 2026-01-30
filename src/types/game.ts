export type AnswerChoice = 1 | 2 | 3 | 4;

export type QuestionType = "choice";

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
};

export type QuestionPublic = Omit<Question, "correctAnswer"> & {
  prompt?: string;
};

export type CharacterProfile = {
  movies: string[];
  shows: string[];
  sports: string[];
  traits: string[];
};

export type Character = {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  portraitSrc: string;
  tags: string[];
  bio: string;
  profile: CharacterProfile;
  questions: Question[];
};

export type CharacterPreview = {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  portraitSrc: string;
  tags: string[];
  bio: string;
};

export type CharacterPublic = CharacterPreview & {
  questions: QuestionPublic[];
};

export type TurnLog = {
  id: string;
  questionId: string;
  questionPrompt: string;
  answerChoice: AnswerChoice;
  answerText: string;
  suspicionBefore: number;
  suspicionAfter: number;
  glitchChance: number;
  timestamp: string;
};

export type SessionStatus = "in_progress" | "ended";

export type FinalDecision = "accuse" | "trust" | null;

export type FinalOutcome = "win" | "lose" | null;

export type ScoreBreakdown = {
  base: number;
  questionBonus: number;
  suspicionBonus: number;
  consolation: number;
  total: number;
};

export type Session = {
  id: string;
  seed: string;
  characterId: string;
  isAlien: boolean;
  askedQuestionIds: string[];
  turns: TurnLog[];
  suspicion: number;
  status: SessionStatus;
  finalDecision: FinalDecision;
  finalOutcome: FinalOutcome;
  score: number;
  scoreBreakdown: ScoreBreakdown | null;
};

export type SessionPublic = Omit<Session, "seed" | "isAlien">;
