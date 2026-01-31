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
