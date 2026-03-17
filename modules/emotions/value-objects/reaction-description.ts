import * as v from "valibot";
import { ReactionDescriptionMax, ReactionDescriptionMin } from "./reaction-description.validation";

const ReactionDescriptionErrors = { invalid: "reaction.description.invalid" };

export const ReactionDescriptionSchema = v.pipe(
  v.string(ReactionDescriptionErrors.invalid),
  v.trim(),
  v.minLength(ReactionDescriptionMin, ReactionDescriptionErrors.invalid),
  v.maxLength(ReactionDescriptionMax, ReactionDescriptionErrors.invalid),
);

/** @public */
export type ReactionDescriptionType = v.InferOutput<typeof ReactionDescriptionSchema>;

export class ReactionDescription {
  static readonly Errors = ReactionDescriptionErrors;
  static readonly MinimumLength = ReactionDescriptionMin;
  static readonly MaximumLength = ReactionDescriptionMax;

  private readonly value: ReactionDescriptionType;

  constructor(value: ReactionDescriptionType) {
    this.value = v.parse(ReactionDescriptionSchema, value);
  }

  get(): ReactionDescriptionType {
    return this.value;
  }

  equals(other: ReactionDescription): boolean {
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
