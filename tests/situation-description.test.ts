import { describe, expect, test } from "bun:test";
import { SituationDescription } from "+emotions/value-objects";

describe("SituationDescription", () => {
  test("constructor - creates with minimum length", () => {
    const situationDescription = new SituationDescription(
      "a".repeat(SituationDescription.MinimumLength),
    ).get();

    expect(situationDescription).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const situationDescription = new SituationDescription(
      "a".repeat(SituationDescription.MaximumLength),
    ).get();

    expect(situationDescription).toEqual("a".repeat(256));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new SituationDescription("")).toThrow(SituationDescription.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new SituationDescription("a".repeat(SituationDescription.MaximumLength + 1))).toThrow(
      SituationDescription.Errors.invalid,
    );
  });

  test("constructor - rejects empty input", () => {
    expect(() => new SituationDescription("    ")).toThrow(SituationDescription.Errors.invalid);
  });

  test("equals - true", () => {
    const abc = new SituationDescription("abc");
    const anotherAbc = new SituationDescription("abc");
    expect(abc.equals(anotherAbc)).toEqual(true);
  });

  test("equals - false", () => {
    const abc = new SituationDescription("abc");
    const def = new SituationDescription("def");
    expect(abc.equals(def)).toEqual(false);
  });

  test("length", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.length()).toEqual(3);
  });

  test("contains - true", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.contains("bc")).toEqual(true);
  });

  test("contains - false", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.contains("def")).toEqual(false);
  });

  test("matches - true", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.matches(/bc/)).toEqual(true);
  });

  test("matches - false", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.matches(/def/)).toEqual(false);
  });

  test("toString", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const situationDescription = new SituationDescription("abc");
    expect(situationDescription.toJSON()).toEqual("abc");
  });
});
