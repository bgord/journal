import { z } from "zod/v4";

const AdviceErrors = { Invalid: "emotional.advice.invalid" };

const AdviceMin = 1;
const AdviceMax = 1024;

export const AdviceSchema = z
  .string(AdviceErrors.Invalid)
  .trim()
  .min(AdviceMin, AdviceErrors.Invalid)
  .max(AdviceMax, AdviceErrors.Invalid);

export type AdviceType = z.infer<typeof AdviceSchema>;

export class Advice {
  static readonly Errors = AdviceErrors;
  static readonly MinimumLength = AdviceMin;
  static readonly MaximumLength = AdviceMax;

  private readonly value: AdviceType;

  constructor(value: AdviceType) {
    this.value = AdviceSchema.parse(value);
  }

  get(): AdviceType {
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
