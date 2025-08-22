import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import { BaseEventData } from "../../../base";

export const HOUR_HAS_PASSED_EVENT = "HOUR_HAS_PASSED_EVENT";

export const HourHasPassedEvent = z.object({
  ...BaseEventData,
  name: z.literal(HOUR_HAS_PASSED_EVENT),
  payload: z.object({ timestamp: tools.Timestamp }),
});

export type HourHasPassedEventType = z.infer<typeof HourHasPassedEvent>;
