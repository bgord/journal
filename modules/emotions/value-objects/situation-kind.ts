import * as v from "valibot";
import { SituationKindOptions } from "./situation-kind-options";

const SituationKindErrors = { Invalid: "situation.kind.invalid" };

export const SituationKindSchema = v.enum(SituationKindOptions, SituationKindErrors.Invalid);

/** @public */
export type SituationKindType = v.InferOutput<typeof SituationKindSchema>;

export class SituationKind {
  static readonly Errors = SituationKindErrors;

  private readonly value: SituationKindType;

  constructor(value: SituationKindType) {
    this.value = v.parse(SituationKindSchema, value);
  }

  get(): SituationKindType {
    return this.value;
  }

  equals(other: SituationKind): boolean {
    return this.get() === other.get();
  }

  static all(): ReadonlyArray<SituationKindType> {
    return SituationKindSchema.options;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
