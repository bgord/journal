import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_CANCELLED_EVENT = "ALARM_CANCELLED_EVENT";

export const AlarmCancelledEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ALARM_CANCELLED_EVENT),
  payload: v.object({ alarmId: VO.AlarmId, userId: Auth.VO.UserId }),
});

export type AlarmCancelledEventType = v.InferOutput<typeof AlarmCancelledEvent>;
