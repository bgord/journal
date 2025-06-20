import { z } from "zod/v4";

const EmotionLabelErrors = { invalid: "emotion.label.invalid" };

// https://en.wikipedia.org/wiki/Geneva_drive
/** @public */
export enum GenevaWheelEmotion {
  joy = "joy",
  pleasure = "pleasure",
  pride = "pride",
  gratitude = "gratitude",
  admiration = "admiration",
  love = "love",
  relief = "relief",
  interest = "interest",
  hope = "hope",
  surprise_positive = "surprise_positive",
  anger = "anger",
  disgust = "disgust",
  contempt = "contempt",
  hate = "hate",
  sadness = "sadness",
  fear = "fear",
  shame = "shame",
  guilt = "guilt",
  boredom = "boredom",
  surprise_negative = "surprise_negative",
}

export const EmotionLabelSchema = z.enum(GenevaWheelEmotion, {
  error: EmotionLabelErrors.invalid,
});

type EmotionLabelType = z.infer<typeof EmotionLabelSchema>;

export class EmotionLabel {
  static readonly Errors = EmotionLabelErrors;

  private readonly value: EmotionLabelType;

  constructor(value: EmotionLabelType) {
    this.value = EmotionLabelSchema.parse(value);
  }

  get(): EmotionLabelType {
    return this.value;
  }

  equals(another: EmotionLabel): boolean {
    return this.get() === another.get();
  }

  isPositive() {
    return [
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
    ].includes(this.get());
  }

  isNegative() {
    return [
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
    ].includes(this.get());
  }

  static all(): EmotionLabelType[] {
    return EmotionLabelSchema.options;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
