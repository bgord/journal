import * as AI from "+ai";
import { describe, expect, test } from "bun:test";

describe("EmotionalAdvice", () => {
  test("constructor - creates with minimum length", () => {
    const emotionalAdvice = new AI.Advice("a".repeat(AI.Advice.MinimumLength)).get();

    expect(emotionalAdvice).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const emotionalAdvice = new AI.Advice("a".repeat(AI.Advice.MaximumLength)).get();

    expect(emotionalAdvice).toEqual("a".repeat(1024));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new AI.Advice("")).toThrow(AI.Advice.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new AI.Advice("a".repeat(AI.Advice.MaximumLength + 1))).toThrow(AI.Advice.Errors.invalid);
  });

  test("constructor - rejects empty input", () => {
    expect(() => new AI.Advice("    ")).toThrow(AI.Advice.Errors.invalid);
  });

  test("length", () => {
    const emotionalAdvice = new AI.Advice("abc");

    expect(emotionalAdvice.length()).toEqual(3);
  });

  test("toString", () => {
    const emotionalAdvice = new AI.Advice("abc");

    expect(emotionalAdvice.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const emotionalAdvice = new AI.Advice("abc");

    expect(emotionalAdvice.toJSON()).toEqual("abc");
  });
});
