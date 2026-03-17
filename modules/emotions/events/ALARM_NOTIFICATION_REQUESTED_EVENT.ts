import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_NOTIFICATION_REQUESTED_EVENT = "ALARM_NOTIFICATION_REQUESTED_EVENT";

export const AlarmNotificationRequestedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ALARM_NOTIFICATION_REQUESTED_EVENT),
  payload: v.object({
    alarmId: VO.AlarmId,
    alarmName: VO.AlarmName,
    advice: AI.AdviceSchema,
    trigger: VO.AlarmTrigger,
    userId: Auth.VO.UserId,
  }),
});

export type AlarmNotificationRequestedEventType = v.InferOutput<typeof AlarmNotificationRequestedEvent>;
