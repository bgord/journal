import { z } from "zod/v4";

export enum AlarmName {
  NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM = "NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM",
}

export type AlarmNameType = z.infer<typeof AlarmName>;
