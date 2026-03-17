import * as v from "valibot";
import { GenevaWheelEmotion, NegativeEmotions, PositiveEmotions } from "./geneva-wheel-emotion.enum";

const EmotionLabelErrors = { Invalid: "emotion.label.invalid" };

export const EmotionLabelSchema = v.enum(GenevaWheelEmotion, EmotionLabelErrors.Invalid);

/** @public */
export type EmotionLabelType = v.InferOutput<typeof EmotionLabelSchema>;

export class EmotionLabel {
  static readonly Errors = EmotionLabelErrors;

  private readonly value: EmotionLabelType;

  constructor(value: EmotionLabelType) {
    this.value = v.parse(EmotionLabelSchema, value);
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

  static all(): ReadonlyArray<{ positive: boolean; option: EmotionLabelType }> {
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
