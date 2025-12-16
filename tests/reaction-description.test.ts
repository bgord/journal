import { describe, expect, test } from "bun:test";
import { ReactionDescription } from "+emotions/value-objects";

describe("ReactionDescription", () => {
  test("constructor - creates with minimum length", () => {
    const reactionDescription = new ReactionDescription("a".repeat(ReactionDescription.MinimumLength)).get();

    expect(reactionDescription).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const reactionDescription = new ReactionDescription("a".repeat(ReactionDescription.MaximumLength)).get();

    expect(reactionDescription).toEqual("a".repeat(256));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new ReactionDescription("")).toThrow(ReactionDescription.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new ReactionDescription("a".repeat(ReactionDescription.MaximumLength + 1))).toThrow(
      ReactionDescription.Errors.invalid,
    );
  });

  test("constructor - rejects empty input", () => {
    expect(() => new ReactionDescription("    ")).toThrow(ReactionDescription.Errors.invalid);
  });

  test("equals - true", () => {
    const abc = new ReactionDescription("abc");
    const anotherAbc = new ReactionDescription("abc");

    expect(abc.equals(anotherAbc)).toEqual(true);
  });

  test("equals - false", () => {
    const abc = new ReactionDescription("abc");
    const def = new ReactionDescription("def");

    expect(abc.equals(def)).toEqual(false);
  });

  test("length", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.length()).toEqual(3);
  });

  test("contains - true", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.contains("bc")).toEqual(true);
  });

  test("contains - false", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.contains("def")).toEqual(false);
  });

  test("matches - true", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.matches(/bc/)).toEqual(true);
  });

  test("matches - false", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.matches(/def/)).toEqual(false);
  });

  test("toString", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const reactionDescription = new ReactionDescription("abc");

    expect(reactionDescription.toJSON()).toEqual("abc");
  });
});
