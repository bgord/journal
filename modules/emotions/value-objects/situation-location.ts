import { z } from "zod/v4";

const SituationLocationErrors = {
  invalid: "situation.location.invalid",
};

const SituationLocationMin = 1;
const SituationLocationMax = 128;

export const SituationLocationSchema = z
  .string({ message: SituationLocationErrors.invalid })
  .trim()
  .min(SituationLocationMin, { message: SituationLocationErrors.invalid })
  .max(SituationLocationMax, { message: SituationLocationErrors.invalid });

/** @public */
export type SituationLocationType = z.infer<typeof SituationLocationSchema>;

export class SituationLocation {
  static readonly Errors = SituationLocationErrors;
  static readonly MinimumLength = SituationLocationMin;
  static readonly MaximumLength = SituationLocationMax;

  private readonly value: SituationLocationType;

  constructor(value: SituationLocationType) {
    this.value = SituationLocationSchema.parse(value);
  }

  get(): SituationLocationType {
    return this.value;
  }

  equals(other: SituationLocation): boolean {
    return this.value === other.value;
  }

  contains(substring: string): boolean {
    return this.value.includes(substring);
  }

  matches(regex: RegExp): boolean {
    return regex.test(this.value);
  }

  length(): number {
    return this.value.length;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
