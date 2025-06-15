import { describe, expect, test } from "bun:test";

import { EmotionLabel, GenevaWheelEmotion } from "../modules/emotions/value-objects/emotion-label";

describe("EmotionLabel", () => {
  test("constructor - creates all correct emotion labels", () => {
    const options = Object.keys(GenevaWheelEmotion);

    options.forEach((option) =>
      // @ts-expect-error
      expect(new EmotionLabel(option).get()).toEqual(option),
    );
  });

  test("constructor - throws on unknown emotion", () => {
    // @ts-expect-error
    expect(() => new EmotionLabel("something_else")).toThrow(EmotionLabel.Errors.invalid);
  });

  test("compare - true", () => {
    const anger = new EmotionLabel(GenevaWheelEmotion.anger);
    const anotherAnger = new EmotionLabel(GenevaWheelEmotion.anger);

    expect(anger.equals(anotherAnger)).toEqual(true);
  });

  test("compare - false", () => {
    const anger = new EmotionLabel(GenevaWheelEmotion.anger);
    const fear = new EmotionLabel(GenevaWheelEmotion.fear);

    expect(anger.equals(fear)).toEqual(false);
  });

  test("all - returns all options", () => {
    // @ts-expect-error
    expect(EmotionLabel.all()).toEqual(Object.keys(GenevaWheelEmotion));
  });

  test("toString", () => {
    expect(new EmotionLabel(GenevaWheelEmotion.fear).toString()).toEqual(GenevaWheelEmotion.fear);
  });

  test("toJSON", () => {
    expect(new EmotionLabel(GenevaWheelEmotion.fear).toJSON()).toEqual(GenevaWheelEmotion.fear);
  });
});
