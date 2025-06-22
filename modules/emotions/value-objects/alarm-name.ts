import { z } from "zod/v4";

export enum AlarmNameOption {
  NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM = "NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM",
}

export const AlarmName = z.enum(AlarmNameOption);

export type AlarmNameType = z.infer<typeof AlarmNameOption>;
