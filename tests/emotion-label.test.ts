import { describe, expect, test } from "bun:test";
import { EmotionLabel } from "../modules/emotions/value-objects/emotion-label";
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";

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

  test("isPositive - true", () => {
    [
      GenevaWheelEmotion.joy,
      GenevaWheelEmotion.pleasure,
      GenevaWheelEmotion.pride,
      GenevaWheelEmotion.gratitude,
      GenevaWheelEmotion.admiration,
      GenevaWheelEmotion.love,
      GenevaWheelEmotion.relief,
      GenevaWheelEmotion.interest,
      GenevaWheelEmotion.hope,
      GenevaWheelEmotion.surprise_positive,
    ].forEach((label) => expect(new EmotionLabel(label).isPositive()).toEqual(true));
  });

  test("isPositive - false", () => {
    [
      GenevaWheelEmotion.anger,
      GenevaWheelEmotion.disgust,
      GenevaWheelEmotion.contempt,
      GenevaWheelEmotion.hate,
      GenevaWheelEmotion.sadness,
      GenevaWheelEmotion.fear,
      GenevaWheelEmotion.shame,
      GenevaWheelEmotion.guilt,
      GenevaWheelEmotion.boredom,
      GenevaWheelEmotion.surprise_negative,
    ].forEach((label) => expect(new EmotionLabel(label).isPositive()).toEqual(false));
  });

  test("isNegative - true", () => {
    [
      GenevaWheelEmotion.anger,
      GenevaWheelEmotion.disgust,
      GenevaWheelEmotion.contempt,
      GenevaWheelEmotion.hate,
      GenevaWheelEmotion.sadness,
      GenevaWheelEmotion.fear,
      GenevaWheelEmotion.shame,
      GenevaWheelEmotion.guilt,
      GenevaWheelEmotion.boredom,
      GenevaWheelEmotion.surprise_negative,
    ].forEach((label) => expect(new EmotionLabel(label).isNegative()).toEqual(true));
  });

  test("isNegative - false", () => {
    [
      GenevaWheelEmotion.joy,
      GenevaWheelEmotion.pleasure,
      GenevaWheelEmotion.pride,
      GenevaWheelEmotion.gratitude,
      GenevaWheelEmotion.admiration,
      GenevaWheelEmotion.love,
      GenevaWheelEmotion.relief,
      GenevaWheelEmotion.interest,
      GenevaWheelEmotion.hope,
      GenevaWheelEmotion.surprise_positive,
    ].forEach((label) => expect(new EmotionLabel(label).isNegative()).toEqual(false));
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
