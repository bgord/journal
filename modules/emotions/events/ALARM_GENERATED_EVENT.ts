import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_GENERATED_EVENT = "ALARM_GENERATED_EVENT";

export const AlarmGeneratedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ALARM_GENERATED_EVENT),
  payload: v.object({
    alarmId: VO.AlarmId,
    alarmName: VO.AlarmName,
    trigger: VO.AlarmTrigger,
    userId: Auth.VO.UserId,
  }),
});

export type AlarmGeneratedEventType = v.InferOutput<typeof AlarmGeneratedEvent>;
