import { z } from "zod/v4";

const ReactionTypeErrors = { invalid: "reaction.type.invalid" };

export enum GrossEmotionRegulationStrategy {
  avoidance = "avoidance",
  confrontation = "confrontation",
  distraction = "distraction",
  rumination = "rumination",
  reappraisal = "reappraisal",
  suppression = "suppression",
  expression = "expression",
  acceptance = "acceptance",
  humor = "humor",
  problem_solving = "problem_solving",
}

const ReactionTypeSchema = z.enum(GrossEmotionRegulationStrategy, {
  message: ReactionTypeErrors.invalid,
});

type ReactionTypeType = z.infer<typeof ReactionTypeSchema>;

export class ReactionType {
  static readonly Errors = ReactionTypeErrors;

  private readonly value: ReactionTypeType;

  constructor(value: ReactionTypeType) {
    this.value = ReactionTypeSchema.parse(value);
  }

  get(): ReactionTypeType {
    return this.value;
  }

  isAdaptive(): boolean {
    return [
      GrossEmotionRegulationStrategy.reappraisal,
      GrossEmotionRegulationStrategy.expression,
      GrossEmotionRegulationStrategy.acceptance,
      GrossEmotionRegulationStrategy.problem_solving,
      GrossEmotionRegulationStrategy.humor,
    ].includes(this.value);
  }

  isMaladaptive(): boolean {
    return [
      GrossEmotionRegulationStrategy.avoidance,
      GrossEmotionRegulationStrategy.rumination,
      GrossEmotionRegulationStrategy.suppression,
    ].includes(this.value);
  }

  isContextual(): boolean {
    return [GrossEmotionRegulationStrategy.distraction, GrossEmotionRegulationStrategy.confrontation].includes(
      this.value,
    );
  }

  equals(another: ReactionType): boolean {
    return this.get() === another.get();
  }

  static all(): ReactionTypeType[] {
    return ReactionTypeSchema.options;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
