import { describe, expect, test } from "bun:test";
import { SituationKind, SituationKindOptions } from "../modules/emotions/value-objects/situation-kind";

describe("SituationKind", () => {
  test("constructor - creates all correct emotion labels", () => {
    const options = Object.keys(SituationKindOptions);

    options.forEach((option) =>
      // @ts-expect-error
      expect(new SituationKind(option).get()).toEqual(option),
    );
  });

  test("constructor - throws on unknown emotion", () => {
    // @ts-expect-error
    expect(() => new SituationKind("something_else")).toThrow(SituationKind.Errors.invalid);
  });

  test("compare - true", () => {
    const achievement = new SituationKind(SituationKindOptions.achievement);
    const anotherAchievement = new SituationKind(SituationKindOptions.achievement);

    expect(achievement.equals(anotherAchievement)).toEqual(true);
  });

  test("compare - false", () => {
    const achievement = new SituationKind(SituationKindOptions.achievement);
    const aloneTime = new SituationKind(SituationKindOptions.alone_time);

    expect(achievement.equals(aloneTime)).toEqual(false);
  });

  test("all - returns all options", () => {
    // @ts-expect-error
    expect(SituationKind.all()).toEqual(Object.keys(SituationKindOptions));
  });

  test("toString", () => {
    expect(new SituationKind(SituationKindOptions.achievement).toString()).toEqual(
      SituationKindOptions.achievement,
    );
  });

  test("toJSON", () => {
    expect(new SituationKind(SituationKindOptions.achievement).toJSON()).toEqual(
      SituationKindOptions.achievement,
    );
  });
});
