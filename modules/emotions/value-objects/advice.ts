import { z } from "zod/v4";

const AdviceErrors = { invalid: "emotional.advice.invalid" };

const AdviceMin = 1;
const AdviceMax = 1024;

export const AdviceSchema = z
  .string({ error: AdviceErrors.invalid })
  .trim()
  .min(AdviceMin, { error: AdviceErrors.invalid })
  .max(AdviceMax, { error: AdviceErrors.invalid });

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
