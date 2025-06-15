import { EmotionIntensity } from "../value-objects/emotion-intensity";
import { EmotionLabel } from "../value-objects/emotion-label";

export class Emotion {
  constructor(
    public readonly label: EmotionLabel,
    public readonly intensity: EmotionIntensity,
  ) {}
}
