import { z } from "zod";

export const createSessionSchema = z.object({
  characterId: z.string().min(1)
});

export const askQuestionSchema = z.object({
  questionId: z.string().min(1)
});

export const decideSchema = z.object({
  decision: z.enum(["accuse", "trust"])
});

export const answerCheckSchema = z.object({
  characterId: z.string().min(1),
  questionId: z.string().min(1),
  answer: z.string().min(1)
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const startSessionSchema = z.object({
  sessionId: z.string().optional(),
  characterId: z.string().optional()
});

export const sessionEventSchema = z.object({
  type: z.enum(["QUESTION_ASKED", "CORRECT_GUESS", "WRONG_GUESS", "TIME_BONUS", "OTHER"])
});

export const finishSessionSchema = z.object({
  status: z.enum(["COMPLETED", "ABANDONED"]).optional(),
  outcome: z.enum(["WIN", "LOSE"]).optional(),
  questionCount: z.number().int().min(0).optional(),
  characterId: z.string().min(1).optional()
});
