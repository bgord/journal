import { z } from "zod/v4";

const EmotionIntensityErrors = { min_max: "emotion.intensity.min.max" };

const EmotionIntensityMin = 1;
const EmotionIntensityMax = 5;

export const EmotionIntensitySchema = z
  .int({ message: EmotionIntensityErrors.min_max })
  .gte(EmotionIntensityMin, { message: EmotionIntensityErrors.min_max })
  .lte(EmotionIntensityMax, { message: EmotionIntensityErrors.min_max });

/** @public */
export type EmotionIntensityType = z.infer<typeof EmotionIntensitySchema>;

export class EmotionIntensity {
  static readonly Errors = EmotionIntensityErrors;
  static readonly Minimum = EmotionIntensityMin;
  static readonly Maximum = EmotionIntensityMax;

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

  isMild(): boolean {
    return this.get() < 3;
  }

  isExtreme(): boolean {
    return this.get() === 5;
  }

  equals(other: EmotionIntensity): boolean {
    return this.get() === other.get();
  }

  static range(): EmotionIntensityType[] {
    return Array.from({ length: EmotionIntensityMax }).map((_, index) => index + 1);
  }

  toString(): string {
    return this.value.toString();
  }

  toJSON(): number {
    return this.value;
  }
}
