import { z } from "zod/v4";
import { SituationKindOptions } from "./situation-kind-options";

const SituationKindErrors = { Invalid: "situation.kind.invalid" };

export const SituationKindSchema = z.enum(SituationKindOptions, {
  message: SituationKindErrors.Invalid,
});

/** @public */
export type SituationKindType = z.infer<typeof SituationKindSchema>;

export class SituationKind {
  static readonly Errors = SituationKindErrors;

  private readonly value: SituationKindType;

  constructor(value: SituationKindType) {
    this.value = SituationKindSchema.parse(value);
  }

  get(): SituationKindType {
    return this.value;
  }

  equals(other: SituationKind): boolean {
    return this.get() === other.get();
  }

  static all(): SituationKindType[] {
    return SituationKindSchema.options;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
