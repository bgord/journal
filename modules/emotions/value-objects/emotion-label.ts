import * as z from "zod/v4";
import { GenevaWheelEmotion, NegativeEmotions, PositiveEmotions } from "./geneva-wheel-emotion.enum";

const EmotionLabelErrors = { Invalid: "emotion.label.invalid" };

export const EmotionLabelSchema = z.enum(GenevaWheelEmotion, {
  error: EmotionLabelErrors.Invalid,
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
    return PositiveEmotions.includes(this.get());
  }

  isNegative() {
    return NegativeEmotions.includes(this.get());
  }

  static all(): { positive: boolean; option: EmotionLabelType }[] {
    return EmotionLabelSchema.options.map((option) => ({
      positive: new EmotionLabel(option).isPositive(),
      option,
    }));
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
