import type { EmotionIntensity } from "../value-objects/emotion-intensity";
import type { EmotionLabel } from "../value-objects/emotion-label";

export class Emotion {
  constructor(
    public readonly label: EmotionLabel,
    public readonly intensity: EmotionIntensity,
  ) {}
}
