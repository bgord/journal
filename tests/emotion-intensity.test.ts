import { describe, expect, test } from "bun:test";

import { EmotionIntensity } from "../modules/emotions/value-objects/emotion-intensity";

describe("EmotionIntensity", () => {
  test("creates correct minimum emotion intensity", () => {
    expect(new EmotionIntensity(1).get()).toEqual(1);
  });

  test("creates correct maximum emotion intensity", () => {
    expect(new EmotionIntensity(5).get()).toEqual(5);
  });

  test("creates correct medium emotion intensity", () => {
    expect(new EmotionIntensity(3).get()).toEqual(3);
  });

  test("rejects less than minimum emotion intensity", () => {
    expect(() => new EmotionIntensity(0)).toThrow(EmotionIntensity.Errors.min_max);
  });

  test("rejects more than minimum emotion intensity", () => {
    expect(() => new EmotionIntensity(6)).toThrow(EmotionIntensity.Errors.min_max);
  });

  test("rejects non-integer emotion intensity", () => {
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
});
