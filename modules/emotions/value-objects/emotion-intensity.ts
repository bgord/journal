import * as v from "valibot";
import { EmotionIntensityMax, EmotionIntensityMin } from "./emotion-intensity.validation";

const EmotionIntensityErrors = { min_max: "emotion.intensity.min.max" };

export const EmotionIntensitySchema = v.pipe(
  v.number(EmotionIntensityErrors.min_max),
  v.integer(EmotionIntensityErrors.min_max),
  v.minValue(EmotionIntensityMin, EmotionIntensityErrors.min_max),
  v.maxValue(EmotionIntensityMax, EmotionIntensityErrors.min_max),
);

/** @public */
export type EmotionIntensityType = v.InferOutput<typeof EmotionIntensitySchema>;

export class EmotionIntensity {
  static readonly Errors = EmotionIntensityErrors;
  static readonly Minimum = EmotionIntensityMin;
  static readonly Maximum = EmotionIntensityMax;

  private readonly value: EmotionIntensityType;

  constructor(value: EmotionIntensityType) {
    this.value = v.parse(EmotionIntensitySchema, value);
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

  static range(): ReadonlyArray<EmotionIntensityType> {
    return Array.from({ length: EmotionIntensityMax }).map((_, index) => index + 1);
  }

  toString(): string {
    return this.value.toString();
  }

  toJSON(): number {
    return this.value;
  }
}
