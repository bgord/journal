import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+emotions/value-objects";

export const ALARM_NOTIFICATION_SENT_EVENT = "ALARM_NOTIFICATION_SENT_EVENT";

export const AlarmNotificationSentEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ALARM_NOTIFICATION_SENT_EVENT),
  payload: v.object({ alarmId: VO.AlarmId }),
});

export type AlarmNotificationSentEventType = v.InferOutput<typeof AlarmNotificationSentEvent>;
