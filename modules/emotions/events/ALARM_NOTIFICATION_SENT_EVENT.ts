import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";

export const ALARM_NOTIFICATION_SENT_EVENT = "ALARM_NOTIFICATION_SENT_EVENT";

export const AlarmNotificationSentEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(ALARM_NOTIFICATION_SENT_EVENT),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type AlarmNotificationSentEventType = z.infer<typeof AlarmNotificationSentEvent>;
