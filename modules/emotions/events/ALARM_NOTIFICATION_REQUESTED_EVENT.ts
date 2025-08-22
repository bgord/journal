import { z } from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const ALARM_NOTIFICATION_REQUESTED_EVENT = "ALARM_NOTIFICATION_REQUESTED_EVENT";

export const AlarmNotificationRequestedEvent = z.object({
  ...BaseEventData,
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
