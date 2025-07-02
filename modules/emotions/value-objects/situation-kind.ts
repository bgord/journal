import { z } from "zod/v4";

const SituationKindErrors = { invalid: "situation.kind.invalid" };

/** @public */
export enum SituationKindOptions {
  conflict = "conflict",
  achievement = "achievement",
  failure = "failure",
  rejection = "rejection",
  praise = "praise",
  routine = "routine",
  unexpected_change = "unexpected_change",
  social_event = "social_event",
  alone_time = "alone_time",
  work = "work",
  school = "school",
  health = "health",
  relationship = "relationship",
  money = "money",
  environment = "environment",
  technology = "technology",
  waiting = "waiting",
  decision_making = "decision_making",
  transition = "transition",
  memory_or_thought = "memory_or_thought",
  other = "other",
}

export const SituationKindSchema = z.enum(SituationKindOptions, {
  message: SituationKindErrors.invalid,
});

type SituationKindType = z.infer<typeof SituationKindSchema>;

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
