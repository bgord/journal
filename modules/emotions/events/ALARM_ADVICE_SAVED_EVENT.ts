import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_ADVICE_SAVED_EVENT = "ALARM_ADVICE_SAVED_EVENT";

export const AlarmAdviceSavedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(ALARM_ADVICE_SAVED_EVENT),
  payload: v.object({ alarmId: VO.AlarmId, advice: AI.AdviceSchema, userId: Auth.VO.UserId }),
});

export type AlarmAdviceSavedEventType = v.InferOutput<typeof AlarmAdviceSavedEvent>;
