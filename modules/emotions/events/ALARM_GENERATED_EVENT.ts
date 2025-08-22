import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const ALARM_GENERATED_EVENT = "ALARM_GENERATED_EVENT";

export const AlarmGeneratedEvent = z.object({
  ...BaseEventData,
  name: z.literal(ALARM_GENERATED_EVENT),
  payload: z.object({
    alarmId: VO.AlarmId,
    alarmName: VO.AlarmName,
    trigger: VO.AlarmTrigger,
    userId: Auth.VO.UserId,
  }),
});

export type AlarmGeneratedEventType = z.infer<typeof AlarmGeneratedEvent>;
