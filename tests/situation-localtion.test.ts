import { SituationLocation } from "+emotions/value-objects";
import { describe, expect, test } from "bun:test";

describe("SituationLocation", () => {
  test("constructor - creates with minimum length", () => {
    const situationLocation = new SituationLocation("a".repeat(SituationLocation.MinimumLength)).get();

    expect(situationLocation).toEqual("a");
  });

  test("constructor - creates with maximum length", () => {
    const situationLocation = new SituationLocation("a".repeat(SituationLocation.MaximumLength)).get();

    expect(situationLocation).toEqual("a".repeat(SituationLocation.MaximumLength));
  });

  test("constructor - rejects under the limit", () => {
    expect(() => new SituationLocation("")).toThrow(SituationLocation.Errors.invalid);
  });

  test("constructor - rejects over the limit", () => {
    expect(() => new SituationLocation("a".repeat(SituationLocation.MaximumLength + 1))).toThrow(
      SituationLocation.Errors.invalid,
    );
  });

  test("constructor - rejects empty input", () => {
    expect(() => new SituationLocation("    ")).toThrow(SituationLocation.Errors.invalid);
  });

  test("equals - true", () => {
    const abc = new SituationLocation("abc");
    const anotherAbc = new SituationLocation("abc");

    expect(abc.equals(anotherAbc)).toEqual(true);
  });

  test("equals - false", () => {
    const abc = new SituationLocation("abc");
    const def = new SituationLocation("def");

    expect(abc.equals(def)).toEqual(false);
  });

  test("length", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.length()).toEqual(3);
  });

  test("contains - true", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.contains("bc")).toEqual(true);
  });

  test("contains - false", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.contains("def")).toEqual(false);
  });

  test("matches - true", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.matches(/bc/)).toEqual(true);
  });

  test("matches - false", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.matches(/def/)).toEqual(false);
  });

  test("toString", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.toString()).toEqual("abc");
  });

  test("toJSON", () => {
    const situationLocation = new SituationLocation("abc");

    expect(situationLocation.toJSON()).toEqual("abc");
  });
});
