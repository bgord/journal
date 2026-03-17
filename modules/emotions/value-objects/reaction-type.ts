import * as v from "valibot";
import { GrossEmotionRegulationStrategy } from "./gross-emotion-regulation-strategy.enum";

const ReactionTypeErrors = { Invalid: "reaction.type.invalid" };

export const ReactionTypeSchema = v.enum(GrossEmotionRegulationStrategy, ReactionTypeErrors.Invalid);

/** @public */
export type ReactionTypeType = v.InferOutput<typeof ReactionTypeSchema>;

export class ReactionType {
  static readonly Errors = ReactionTypeErrors;

  private readonly value: ReactionTypeType;

  constructor(value: ReactionTypeType) {
    this.value = v.parse(ReactionTypeSchema, value);
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
    return [
      GrossEmotionRegulationStrategy.distraction,
      GrossEmotionRegulationStrategy.confrontation,
      GrossEmotionRegulationStrategy.other,
    ].includes(this.value);
  }

  equals(another: ReactionType): boolean {
    return this.get() === another.get();
  }

  static all(): ReadonlyArray<ReactionTypeType> {
    return ReactionTypeSchema.options;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
