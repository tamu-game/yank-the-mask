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
