import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const ALARM_ADVICE_SAVED_EVENT = "ALARM_ADVICE_SAVED_EVENT";

export const AlarmAdviceSavedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(ALARM_ADVICE_SAVED_EVENT),
  payload: z.object({ alarmId: VO.AlarmId, advice: AI.AdviceSchema, userId: Auth.VO.UserId }),
});

export type AlarmAdviceSavedEventType = z.infer<typeof AlarmAdviceSavedEvent>;
