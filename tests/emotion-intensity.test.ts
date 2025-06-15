import { describe, expect, test } from "bun:test";

import { EmotionIntensity } from "../modules/emotions/value-objects/emotion-intensity";

describe("EmotionIntensity", () => {
  test("constructor - creates correct minimum emotion intensity", () => {
    expect(new EmotionIntensity(1).get()).toEqual(1);
  });

  test("constructor - creates correct maximum emotion intensity", () => {
    expect(new EmotionIntensity(5).get()).toEqual(5);
  });

  test("constructor - creates correct medium emotion intensity", () => {
    expect(new EmotionIntensity(3).get()).toEqual(3);
  });

  test("constructor - rejects less than minimum emotion intensity", () => {
    expect(() => new EmotionIntensity(0)).toThrow(EmotionIntensity.Errors.min_max);
  });

  test("constructor - rejects more than minimum emotion intensity", () => {
    expect(() => new EmotionIntensity(6)).toThrow(EmotionIntensity.Errors.min_max);
  });

  test("constructor - rejects non-integer emotion intensity", () => {
    // @ts-expect-error
    expect(() => new EmotionIntensity("123")).toThrow(EmotionIntensity.Errors.min_max);
  });

  test("isIntensive - false", () => {
    expect(new EmotionIntensity(1).isIntensive()).toEqual(false);
    expect(new EmotionIntensity(2).isIntensive()).toEqual(false);
  });

  test("isIntensive - true", () => {
    expect(new EmotionIntensity(3).isIntensive()).toEqual(true);
    expect(new EmotionIntensity(4).isIntensive()).toEqual(true);
    expect(new EmotionIntensity(5).isIntensive()).toEqual(true);
  });

  test("isMild - true", () => {
    expect(new EmotionIntensity(1).isMild()).toEqual(true);
    expect(new EmotionIntensity(2).isMild()).toEqual(true);
  });

  test("isMild - false", () => {
    expect(new EmotionIntensity(3).isMild()).toEqual(false);
    expect(new EmotionIntensity(4).isMild()).toEqual(false);
    expect(new EmotionIntensity(5).isMild()).toEqual(false);
  });

  test("isExtreme - false", () => {
    expect(new EmotionIntensity(1).isExtreme()).toEqual(false);
    expect(new EmotionIntensity(2).isExtreme()).toEqual(false);
    expect(new EmotionIntensity(3).isExtreme()).toEqual(false);
    expect(new EmotionIntensity(4).isExtreme()).toEqual(false);
  });

  test("isExtreme - true", () => {
    expect(new EmotionIntensity(5).isExtreme()).toEqual(true);
  });

  test("equals - true", () => {
    const one = new EmotionIntensity(1);
    const anotherOne = new EmotionIntensity(1);

    expect(one.equals(anotherOne)).toEqual(true);
  });

  test("equals - false", () => {
    const one = new EmotionIntensity(1);
    const two = new EmotionIntensity(2);

    expect(one.equals(two)).toEqual(false);
  });

  test("range - returns all options", () => {
    expect(EmotionIntensity.range()).toEqual([1, 2, 3, 4, 5]);
  });

  test("toString", () => {
    expect(new EmotionIntensity(1).toString()).toEqual("1");
  });

  test("toJSON", () => {
    expect(new EmotionIntensity(1).toJSON()).toEqual(1);
  });
});
