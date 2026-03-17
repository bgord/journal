import * as v from "valibot";

const AdviceErrors = { Invalid: "emotional.advice.invalid" };

const AdviceMin = 1;
const AdviceMax = 1024;

export const AdviceSchema = v.pipe(
  v.string(AdviceErrors.Invalid),
  v.trim(),
  v.minLength(AdviceMin, AdviceErrors.Invalid),
  v.maxLength(AdviceMax, AdviceErrors.Invalid),
);

export type AdviceType = v.InferOutput<typeof AdviceSchema>;

export class Advice {
  static readonly Errors = AdviceErrors;
  static readonly MinimumLength = AdviceMin;
  static readonly MaximumLength = AdviceMax;

  private readonly value: AdviceType;

  constructor(value: AdviceType) {
    this.value = v.parse(AdviceSchema, value);
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
