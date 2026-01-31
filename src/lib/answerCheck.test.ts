import { describe, expect, it } from "vitest";
import { checkAnswer } from "@/lib/answerCheck";
import { getCharacterById } from "@/data/characters";

describe("character questions", () => {
  it("getCharacterById returns character with questions", () => {
    const character = getCharacterById("spider-man");
    expect(character).toBeTruthy();
    expect(character?.questions.length).toBeGreaterThan(0);
  });
});

describe("answer check", () => {
  it("returns true for correct answer", () => {
    const result = checkAnswer({
      characterId: "spider-man",
      questionId: "spider-man_q1",
      answer: "Improvise another swing. Keep smiling."
    });
    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.isCorrect).toBe(true);
    }
  });

  it("returns false for wrong answer", () => {
    const result = checkAnswer({
      characterId: "spider-man",
      questionId: "spider-man_q1",
      answer: "Calculate wind drift mid-air."
    });
    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.isCorrect).toBe(false);
    }
  });

  it("returns 400 when answer is not an option", () => {
    const result = checkAnswer({
      characterId: "spider-man",
      questionId: "spider-man_q1",
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
