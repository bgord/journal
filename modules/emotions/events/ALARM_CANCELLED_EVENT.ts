import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const ALARM_CANCELLED_EVENT = "ALARM_CANCELLED_EVENT";

export const AlarmCancelledEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_CANCELLED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue,
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type AlarmCancelledEventType = z.infer<typeof AlarmCancelledEvent>;
