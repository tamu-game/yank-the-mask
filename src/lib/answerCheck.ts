import { getCharacterById } from "@/data/characters";

export type AnswerCheckInput = {
  characterId: string;
  questionId: string;
  answer: string;
};

type AnswerCheckError = {
  code: "bad_request" | "not_found";
  message: string;
};

export type AnswerCheckResult =
  | { status: 200; body: { isCorrect: boolean } }
  | { status: 400 | 404; body: { error: AnswerCheckError } };

export const checkAnswer = (input: AnswerCheckInput): AnswerCheckResult => {
  const { characterId, questionId, answer } = input;
  const character = getCharacterById(characterId);
  if (!character) {
    return {
      status: 404,
      body: { error: { code: "not_found", message: "Character not found." } }
    };
  }

  const question = character.questions.find((item) => item.id === questionId);
  if (!question) {
    return {
      status: 404,
      body: { error: { code: "not_found", message: "Question not found." } }
    };
  }

  const answerTexts = question.answers.map((item) => item.text);
  if (!answerTexts.includes(answer)) {
    return {
      status: 400,
      body: { error: { code: "bad_request", message: "Answer must match one of the options." } }
    };
  }

  return {
    status: 200,
    body: { isCorrect: true }
  };
};
