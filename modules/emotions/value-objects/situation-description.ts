import * as v from "valibot";
import { SituationDescriptionMax, SituationDescriptionMin } from "./situation-description.validation";

const SituationDescriptionErrors = { Invalid: "situation.description.invalid" };

export const SituationDescriptionSchema = v.pipe(
  v.string(SituationDescriptionErrors.Invalid),
  v.trim(),
  v.minLength(SituationDescriptionMin, SituationDescriptionErrors.Invalid),
  v.maxLength(SituationDescriptionMax, SituationDescriptionErrors.Invalid),
);

/** @public */
export type SituationDescriptionType = v.InferOutput<typeof SituationDescriptionSchema>;

export class SituationDescription {
  static readonly Errors = SituationDescriptionErrors;
  static readonly MinimumLength = SituationDescriptionMin;
  static readonly MaximumLength = SituationDescriptionMax;

  private readonly value: SituationDescriptionType;

  constructor(value: SituationDescriptionType) {
    this.value = v.parse(SituationDescriptionSchema, value);
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
