import type { ReactionDescription } from "../value-objects/reaction-description";
import type { ReactionEffectiveness } from "../value-objects/reaction-effectiveness";
import type { ReactionType } from "../value-objects/reaction-type";

export class Reaction {
  constructor(
    public readonly description: ReactionDescription,
    public readonly type: ReactionType,
    public readonly effectiveness: ReactionEffectiveness,
  ) {}
}
