import { z } from "zod/v4";

export enum AlarmName {
  HIGH_EMOTIONAL_INTENSITY = "HIGH_EMOTIONAL_INTENSITY",
}

export type AlarmNameType = z.infer<typeof AlarmName>;
