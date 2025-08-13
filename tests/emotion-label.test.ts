import { describe, expect, test } from "bun:test";
import { EmotionLabel, GenevaWheelEmotion } from "+emotions/value-objects";

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
    expect(EmotionLabel.all()).toEqual([
      {
        option: GenevaWheelEmotion.joy,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.pleasure,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.pride,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.gratitude,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.admiration,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.love,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.relief,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.interest,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.hope,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.surprise_positive,
        positive: true,
      },
      {
        option: GenevaWheelEmotion.anger,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.disgust,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.contempt,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.hate,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.sadness,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.fear,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.shame,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.guilt,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.boredom,
        positive: false,
      },
      {
        option: GenevaWheelEmotion.surprise_negative,
        positive: false,
      },
    ]);
  });

  test("toString", () => {
    expect(new EmotionLabel(GenevaWheelEmotion.fear).toString()).toEqual(GenevaWheelEmotion.fear);
  });

  test("toJSON", () => {
    expect(new EmotionLabel(GenevaWheelEmotion.fear).toJSON()).toEqual(GenevaWheelEmotion.fear);
  });
});
