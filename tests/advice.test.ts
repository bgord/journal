import { describe, expect, test } from "bun:test";
import { Advice } from "../modules/emotions/value-objects/advice";

describe("EmotionalAdvice", () => {
  test("constructor - creates with minimum length", () => {
    const emotionalAdvice = new Advice("a".repeat(Advice.MinimumLength)).get();

    expect(emotionalAdvice).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const emotionalAdvice = new Advice("a".repeat(Advice.MaximumLength)).get();

    expect(emotionalAdvice).toEqual("a".repeat(1024));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new Advice("")).toThrow(Advice.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new Advice("a".repeat(Advice.MaximumLength + 1))).toThrow(Advice.Errors.invalid);
  });

  test("constructor - rejects empty input", () => {
    expect(() => new Advice("    ")).toThrow(Advice.Errors.invalid);
  });

  test("length", () => {
    const emotionalAdvice = new Advice("abc");

    expect(emotionalAdvice.length()).toEqual(3);
  });

  test("toString", () => {
    const emotionalAdvice = new Advice("abc");

    expect(emotionalAdvice.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const emotionalAdvice = new Advice("abc");

    expect(emotionalAdvice.toJSON()).toEqual("abc");
  });
});
