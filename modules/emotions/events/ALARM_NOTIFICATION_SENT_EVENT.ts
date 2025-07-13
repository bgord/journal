import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const ALARM_NOTIFICATION_SENT_EVENT = "ALARM_NOTIFICATION_SENT_EVENT";

export const AlarmNotificationSentEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(ALARM_NOTIFICATION_SENT_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({ alarmId: VO.AlarmId, entryId: VO.EntryId }),
});

export type AlarmNotificationSentEventType = z.infer<typeof AlarmNotificationSentEvent>;
