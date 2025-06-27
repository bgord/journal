import { describe, expect, test } from "bun:test";
import { EmotionalAdvice } from "../modules/emotions/value-objects/emotional-advice";

describe.skip("EmotionalAdvice", () => {
  test("constructor - creates with minimum length", () => {
    const emotionalAdvice = new EmotionalAdvice("a".repeat(EmotionalAdvice.MinimumLength)).get();

    expect(emotionalAdvice).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const emotionalAdvice = new EmotionalAdvice("a".repeat(EmotionalAdvice.MaximumLength)).get();

    expect(emotionalAdvice).toEqual("a".repeat(1024));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new EmotionalAdvice("")).toThrow(EmotionalAdvice.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new EmotionalAdvice("a".repeat(EmotionalAdvice.MaximumLength + 1))).toThrow(
      EmotionalAdvice.Errors.invalid,
    );
  });

  test("constructor - rejects empty input", () => {
    expect(() => new EmotionalAdvice("    ")).toThrow(EmotionalAdvice.Errors.invalid);
  });

  test("length", () => {
    const emotionalAdvice = new EmotionalAdvice("abc");

    expect(emotionalAdvice.length()).toEqual(3);
  });

  test("toString", () => {
    const emotionalAdvice = new EmotionalAdvice("abc");

    expect(emotionalAdvice.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const emotionalAdvice = new EmotionalAdvice("abc");

    expect(emotionalAdvice.toJSON()).toEqual("abc");
  });
});
