import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_NOTIFICATION_REQUESTED_EVENT = "ALARM_NOTIFICATION_REQUESTED_EVENT";

export const AlarmNotificationRequestedEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(ALARM_NOTIFICATION_REQUESTED_EVENT),
  payload: z.object({
    alarmId: VO.AlarmId,
    alarmName: VO.AlarmName,
    advice: AI.AdviceSchema,
    trigger: VO.AlarmTrigger,
    userId: Auth.VO.UserId,
  }),
});

export type AlarmNotificationRequestedEventType = z.infer<typeof AlarmNotificationRequestedEvent>;
