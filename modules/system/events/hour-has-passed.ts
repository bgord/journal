import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const HOUR_HAS_PASSED_EVENT = "HOUR_HAS_PASSED_EVENT";

export const HourHasPassedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(HOUR_HAS_PASSED_EVENT),
  payload: z.object({ timestamp: tools.Timestamp }),
});

export type HourHasPassedEventType = z.infer<typeof HourHasPassedEvent>;
