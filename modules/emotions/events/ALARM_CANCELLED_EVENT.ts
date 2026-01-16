import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_CANCELLED_EVENT = "ALARM_CANCELLED_EVENT";

export const AlarmCancelledEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(ALARM_CANCELLED_EVENT),
  payload: z.object({ alarmId: VO.AlarmId, userId: Auth.VO.UserId }),
});

export type AlarmCancelledEventType = z.infer<typeof AlarmCancelledEvent>;
