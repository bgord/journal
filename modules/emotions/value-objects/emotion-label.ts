import { z } from "zod/v4";
import { GenevaWheelEmotion } from "./geneva-wheel-emotion.enum";

const EmotionLabelErrors = { invalid: "emotion.label.invalid" };

export const EmotionLabelSchema = z.enum(GenevaWheelEmotion, {
  error: EmotionLabelErrors.invalid,
});

/** @public */
export type EmotionLabelType = z.infer<typeof EmotionLabelSchema>;

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
