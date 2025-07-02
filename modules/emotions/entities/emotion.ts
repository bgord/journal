import * as Emotions from "+emotions";

export class Emotion {
  constructor(
    public readonly label: Emotions.VO.EmotionLabel,
    public readonly intensity: Emotions.VO.EmotionIntensity,
  ) {}
}
