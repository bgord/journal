import { z } from "zod/v4";

const SituationDescriptionErrors = { invalid: "situation.description.invalid" };

const SituationDescriptionMin = 1;
const SituationDescriptionMax = 256;

const SituationDescriptionSchema = z
  .string({ error: SituationDescriptionErrors.invalid })
  .trim()
  .min(SituationDescriptionMin, { error: SituationDescriptionErrors.invalid })
  .max(SituationDescriptionMax, { error: SituationDescriptionErrors.invalid });

type SituationDescriptionType = z.infer<typeof SituationDescriptionSchema>;

export class SituationDescription {
  static readonly Errors = SituationDescriptionErrors;

  static readonly MinimumLength = SituationDescriptionMin;

  static readonly MaximumLength = SituationDescriptionMax;

  private readonly value: SituationDescriptionType;

  constructor(value: SituationDescriptionType) {
    this.value = SituationDescriptionSchema.parse(value);
  }

  get(): SituationDescriptionType {
    return this.value;
  }

  equals(other: SituationDescription): boolean {
    return this.get() === other.get();
  }

  length(): number {
    return this.get().length;
  }

  contains(substring: string): boolean {
    return this.value.includes(substring);
  }

  matches(regex: RegExp): boolean {
    return regex.test(this.value);
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
