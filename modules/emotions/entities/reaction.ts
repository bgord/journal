import * as Emotions from "../";

export class Reaction {
  constructor(
    public readonly description: Emotions.VO.ReactionDescription,
    public readonly type: Emotions.VO.ReactionType,
    public readonly effectiveness: Emotions.VO.ReactionEffectiveness,
  ) {}
}
