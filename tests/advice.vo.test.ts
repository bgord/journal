import { describe, expect, test } from "bun:test";
import * as AI from "+ai";

describe("advice", () => {
  test("constructor - creates with minimum length", () => {
    const advice = new AI.Advice("a".repeat(AI.Advice.MinimumLength)).get();

    expect(advice).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const advice = new AI.Advice("a".repeat(AI.Advice.MaximumLength)).get();

    expect(advice).toEqual("a".repeat(1024));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new AI.Advice("")).toThrow("emotional.advice.invalid");
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new AI.Advice("a".repeat(AI.Advice.MaximumLength + 1))).toThrow("emotional.advice.invalid");
  });

  test("constructor - rejects empty input", () => {
    expect(() => new AI.Advice("    ")).toThrow("emotional.advice.invalid");
  });

  test("length", () => {
    const advice = new AI.Advice("abc");

    expect(advice.length()).toEqual(3);
  });

  test("toString", () => {
    const advice = new AI.Advice("abc");

    expect(advice.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const advice = new AI.Advice("abc");

    expect(advice.toJSON()).toEqual("abc");
  });
});
