import { describe, expect, it } from "vitest";
import { checkAnswer } from "@/lib/answerCheck";
import { characters, getCharacterById } from "@/data/characters";

describe("character questions", () => {
  it("getCharacterById returns character with questions", () => {
    const sample = characters[0];
    const character = sample ? getCharacterById(sample.id) : undefined;
    expect(character).toBeTruthy();
    expect(character?.questions.length).toBeGreaterThan(0);
  });
});

describe("answer check", () => {
  it("returns true for correct answer", () => {
    const sample = characters[0];
    const question = sample?.questions[0];
    const answer = question?.answers[0].text ?? "";
    if (!sample || !question) {
      expect(false).toBe(true);
      return;
    }
    const result = checkAnswer({
      characterId: sample.id,
      questionId: question.id,
      answer
    });
    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.isCorrect).toBe(true);
    }
  });

  it("returns false for wrong answer", () => {
    const sample = characters[0];
    const question = sample?.questions[0];
    const answer = question?.answers[1]?.text ?? question?.answers[0]?.text ?? "";
    if (!sample || !question) {
      expect(false).toBe(true);
      return;
    }
    const result = checkAnswer({
      characterId: sample.id,
      questionId: question.id,
      answer
    });
    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.isCorrect).toBe(true);
    }
  });

  it("returns 400 when answer is not an option", () => {
    const sample = characters[0];
    const question = sample?.questions[0];
    if (!sample || !question) {
      expect(false).toBe(true);
      return;
    }
    const result = checkAnswer({
      characterId: sample.id,
      questionId: question.id,
      answer: "Banana"
    });
    expect(result.status).toBe(400);
  });

  it("returns 404 when question is missing", () => {
    const result = checkAnswer({
      characterId: "spider-man",
      questionId: "missing-question",
      answer: "Camera"
    });
    expect(result.status).toBe(404);
  });

  it("returns 404 when character is missing", () => {
    const result = checkAnswer({
      characterId: "missing-character",
      questionId: "spider-man_q1",
      answer: "Camera"
    });
    expect(result.status).toBe(404);
  });
});
