import { describe, expect, test } from "bun:test";

import { ReactionEffectiveness } from "../modules/emotions/value-objects/reaction-effectiveness";

describe("ReactionEffectiveness", () => {
  test("constructor - creates correct minimum emotion intensity", () => {
    expect(new ReactionEffectiveness(1).get()).toEqual(1);
  });

  test("constructor - creates correct maximum emotion intensity", () => {
    expect(new ReactionEffectiveness(5).get()).toEqual(5);
  });

  test("constructor - creates correct medium emotion intensity", () => {
    expect(new ReactionEffectiveness(3).get()).toEqual(3);
  });

  test("constructor - rejects less than minimum emotion intensity", () => {
    expect(() => new ReactionEffectiveness(0)).toThrow(ReactionEffectiveness.Errors.min_max);
  });

  test("constructor - rejects more than minimum emotion intensity", () => {
    expect(() => new ReactionEffectiveness(6)).toThrow(ReactionEffectiveness.Errors.min_max);
  });

  test("constructor - rejects non-integer emotion intensity", () => {
    // @ts-expect-error
    expect(() => new ReactionEffectiveness("123")).toThrow(ReactionEffectiveness.Errors.min_max);
  });

  test("isEffective - false", () => {
    expect(new ReactionEffectiveness(1).isEffective()).toEqual(false);
    expect(new ReactionEffectiveness(2).isEffective()).toEqual(false);
    expect(new ReactionEffectiveness(3).isEffective()).toEqual(false);
  });

  test("isEffective - true", () => {
    expect(new ReactionEffectiveness(4).isEffective()).toEqual(true);
    expect(new ReactionEffectiveness(5).isEffective()).toEqual(true);
  });

  test("isNeutral - true", () => {
    expect(new ReactionEffectiveness(3).isNeutral()).toEqual(true);
  });

  test("isMild - false", () => {
    expect(new ReactionEffectiveness(1).isNeutral()).toEqual(false);
    expect(new ReactionEffectiveness(2).isNeutral()).toEqual(false);
    expect(new ReactionEffectiveness(4).isNeutral()).toEqual(false);
    expect(new ReactionEffectiveness(5).isNeutral()).toEqual(false);
  });

  test("isIneffective - false", () => {
    expect(new ReactionEffectiveness(3).isIneffective()).toEqual(false);
    expect(new ReactionEffectiveness(4).isIneffective()).toEqual(false);
    expect(new ReactionEffectiveness(5).isIneffective()).toEqual(false);
  });

  test("isIneffective - true", () => {
    expect(new ReactionEffectiveness(1).isIneffective()).toEqual(true);
    expect(new ReactionEffectiveness(2).isIneffective()).toEqual(true);
  });

  test("equals - true", () => {
    const one = new ReactionEffectiveness(1);
    const anotherOne = new ReactionEffectiveness(1);

    expect(one.equals(anotherOne)).toEqual(true);
  });

  test("equals - false", () => {
    const one = new ReactionEffectiveness(1);
    const two = new ReactionEffectiveness(2);

    expect(one.equals(two)).toEqual(false);
  });

  test("range - returns all options", () => {
    expect(ReactionEffectiveness.range()).toEqual([1, 2, 3, 4, 5]);
  });

  test("toString", () => {
    expect(new ReactionEffectiveness(1).toString()).toEqual("1");
  });

  test("toJSON", () => {
    expect(new ReactionEffectiveness(1).toJSON()).toEqual(1);
  });
});
