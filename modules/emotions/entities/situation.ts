import type * as Emotions from "+emotions";

export class Situation {
  constructor(
    public readonly description: Emotions.VO.SituationDescription,
    public readonly location: Emotions.VO.SituationLocation,
    public readonly kind: Emotions.VO.SituationKind,
  ) {}
}
