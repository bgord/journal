import { z } from "zod/v4";

const ReactionEffectivenessErrors = {
  min_max: "reaction.effectiveness.min.max",
};

const ReactionEffectivenessMin = 1;
const ReactionEffectivenessMax = 5;

export const ReactionEffectivenessSchema = z
  .int({ message: ReactionEffectivenessErrors.min_max })
  .gte(ReactionEffectivenessMin, {
    message: ReactionEffectivenessErrors.min_max,
  })
  .lte(ReactionEffectivenessMax, {
    message: ReactionEffectivenessErrors.min_max,
  });

type ReactionEffectivenessType = z.infer<typeof ReactionEffectivenessSchema>;

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

  static range(): ReactionEffectivenessType[] {
    return Array.from({ length: ReactionEffectivenessMax }).map((_, index) => index + 1);
  }

  toString(): string {
    return this.value.toString();
  }

  toJSON(): number {
    return this.value;
  }
}
