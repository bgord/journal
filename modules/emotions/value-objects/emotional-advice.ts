import { z } from "zod/v4";

const EmotionalAdviceErrors = { invalid: "emotional.advice.invalid" };

const EmotionalAdviceMin = 1;
const EmotionalAdviceMax = 1024;

export const EmotionalAdviceSchema = z
  .string({ error: EmotionalAdviceErrors.invalid })
  .trim()
  .min(EmotionalAdviceMin, { error: EmotionalAdviceErrors.invalid })
  .max(EmotionalAdviceMax, { error: EmotionalAdviceErrors.invalid });

type EmotionalAdviceType = z.infer<typeof EmotionalAdviceSchema>;

export class EmotionalAdvice {
  static readonly Errors = EmotionalAdviceErrors;
  static readonly MinimumLength = EmotionalAdviceMin;
  static readonly MaximumLength = EmotionalAdviceMax;

  private readonly value: EmotionalAdviceType;

  constructor(value: EmotionalAdviceType) {
    this.value = EmotionalAdviceSchema.parse(value);
  }

  get(): EmotionalAdviceType {
    return this.value;
  }

  length(): number {
    return this.get().length;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
