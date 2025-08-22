import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as VO from "+emotions/value-objects";

export const ALARM_NOTIFICATION_SENT_EVENT = "ALARM_NOTIFICATION_SENT_EVENT";

export const AlarmNotificationSentEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(ALARM_NOTIFICATION_SENT_EVENT),
  payload: z.object({ alarmId: VO.AlarmId }),
});

export type AlarmNotificationSentEventType = z.infer<typeof AlarmNotificationSentEvent>;
