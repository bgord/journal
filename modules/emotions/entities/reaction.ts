import { ReactionDescription } from "../value-objects/reaction-description";
import { ReactionEffectiveness } from "../value-objects/reaction-effectiveness";
import { ReactionType } from "../value-objects/reaction-type";

export class Reaction {
  constructor(
    public readonly description: ReactionDescription,
    public readonly type: ReactionType,
    public readonly effectiveness: ReactionEffectiveness,
  ) {}
}
