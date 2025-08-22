import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const ALARM_CANCELLED_EVENT = "ALARM_CANCELLED_EVENT";

export const AlarmCancelledEvent = z.object({
  ...BaseEventData,
  name: z.literal(ALARM_CANCELLED_EVENT),
  payload: z.object({ alarmId: VO.AlarmId, userId: Auth.VO.UserId }),
});

export type AlarmCancelledEventType = z.infer<typeof AlarmCancelledEvent>;
