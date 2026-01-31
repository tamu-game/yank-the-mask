export type AnswerChoice = 1 | 2 | 3 | 4;

export type AnswerOption = {
  text: string;
  suspicion: 0 | 1 | 2 | 3;
};

export type Question = {
  id: string;
  prompt: string;
  answers: AnswerOption[];
};

export type QuestionPublic = Pick<Question, "id" | "prompt">;

export type Character = {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  portraitSrc: string;
  tags: string[];
  bio: string;
  traits: string[];
  likes: string[];
  dislikes: string[];
  quirks: string[];
  hangout: string;
  observation: string;
  whispers: string;
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
  traits: string[];
  likes: string[];
  dislikes: string[];
  quirks: string[];
  hangout: string;
  observation: string;
  whispers: string;
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
