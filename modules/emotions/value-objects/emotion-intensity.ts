import { z } from "zod/v4";

const EmotionIntensityErrors = { min_max: "emotion.intensity.min.max" };

const EmotionIntensitySchema = z
  .int({ message: EmotionIntensityErrors.min_max })
  .gte(1, { message: EmotionIntensityErrors.min_max })
  .lte(5, { message: EmotionIntensityErrors.min_max });

type EmotionIntensityType = z.infer<typeof EmotionIntensitySchema>;

export class EmotionIntensity {
  static readonly Errors = EmotionIntensityErrors;

  private readonly value: EmotionIntensityType;

  constructor(value: EmotionIntensityType) {
    this.value = EmotionIntensitySchema.parse(value);
  }

  get(): EmotionIntensityType {
    return this.value;
  }

  isIntensive(): boolean {
    return this.get() >= 3;
  }
}
