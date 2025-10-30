import { z } from "zod/v4";
import { ReactionDescriptionMax, ReactionDescriptionMin } from "./reaction-description.validation";

const ReactionDescriptionErrors = { invalid: "reaction.description.invalid" };

export const ReactionDescriptionSchema = z
  .string({ message: ReactionDescriptionErrors.invalid })
  .trim()
  .min(ReactionDescriptionMin, { message: ReactionDescriptionErrors.invalid })
  .max(ReactionDescriptionMax, { message: ReactionDescriptionErrors.invalid });

/** @public */
export type ReactionDescriptionType = z.infer<typeof ReactionDescriptionSchema>;

export class ReactionDescription {
  static readonly Errors = ReactionDescriptionErrors;
  static readonly MinimumLength = ReactionDescriptionMin;
  static readonly MaximumLength = ReactionDescriptionMax;

  private readonly value: ReactionDescriptionType;

  constructor(value: ReactionDescriptionType) {
    this.value = ReactionDescriptionSchema.parse(value);
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
