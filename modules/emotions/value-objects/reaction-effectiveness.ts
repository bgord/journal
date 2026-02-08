import * as z from "zod/v4";
import { ReactionEffectivenessMax, ReactionEffectivenessMin } from "./reaction-effectiveness.validation";

const ReactionEffectivenessErrors = { min_max: "reaction.effectiveness.min.max" };

export const ReactionEffectivenessSchema = z
  .int(ReactionEffectivenessErrors.min_max)
  .gte(ReactionEffectivenessMin, ReactionEffectivenessErrors.min_max)
  .lte(ReactionEffectivenessMax, ReactionEffectivenessErrors.min_max);

/** @public */
export type ReactionEffectivenessType = z.infer<typeof ReactionEffectivenessSchema>;

export class ReactionEffectiveness {
  static readonly Errors = ReactionEffectivenessErrors;
  static readonly Minimum = ReactionEffectivenessMin;
  static readonly Maximum = ReactionEffectivenessMax;

  private readonly value: ReactionEffectivenessType;

  constructor(value: ReactionEffectivenessType) {
    this.value = ReactionEffectivenessSchema.parse(value);
  }

  get(): ReactionEffectivenessType {
    return this.value;
  }

  isEffective(): boolean {
    return this.value >= 4;
  }

  isNeutral(): boolean {
    return this.value === 3;
  }

  isIneffective(): boolean {
    return this.value < 3;
  }

  equals(other: ReactionEffectiveness): boolean {
    return this.value === other.value;
  }

  static range(): ReadonlyArray<ReactionEffectivenessType> {
    return Array.from({ length: ReactionEffectivenessMax }).map((_, index) => index + 1);
  }

  toString(): string {
    return this.value.toString();
  }

  toJSON(): number {
    return this.value;
  }
}
